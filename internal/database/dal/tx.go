package dal

import (
	"errors"
	"math"

	"git.zyner.org/meta/xyter/internal/database"
	"git.zyner.org/meta/xyter/internal/types/err"
	"git.zyner.org/meta/xyter/internal/utils"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	metric_transactions = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "xyter_transactions",
			Help: "How many transactions have been done.",
		},
		[]string{"guild_id", "type"},
	)
)

func GetBalance(db *gorm.DB, guildID, userID string) (int, error) {
	var credit database.GuildMemberCredit
	err := db.First(&credit, "guild_id = ? AND user_id = ?", guildID, userID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}
	return credit.Balance, err
}

func GiveCredits(db *gorm.DB, guildID, userID string, amount int) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := utils.ValidateTransaction(guildID, userID, amount); err != nil {
			return err
		}

		if err := utils.UpsertGuildMember(tx, guildID, userID); err != nil {
			return err
		}

		err := tx.Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "guild_id"}, {Name: "user_id"}},
			DoUpdates: clause.Assignments(map[string]interface{}{
				"balance": gorm.Expr("guild_member_credits.balance + ?", amount),
			}),
		}).Create(&database.GuildMemberCredit{
			GuildID: guildID,
			UserID:  userID,
			Balance: amount,
		}).Error

		return err
	})
	if err != nil {
		return err
	}
	metric_transactions.WithLabelValues(guildID, "give").Add(1)
	return err
}

func TakeCredits(db *gorm.DB, guildID, userID string, amount int) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := utils.ValidateTransaction(guildID, userID, amount); err != nil {
			return err
		}

		var credit database.GuildMemberCredit
		if err := tx.First(&credit, "guild_id = ? AND user_id = ?", guildID, userID).Error; err != nil {
			return err
		}

		if credit.Balance < amount {
			return err.ErrInsufficientFunds
		}

		err := tx.Model(&database.GuildMemberCredit{}).
			Where("guild_id = ? AND user_id = ?", guildID, userID).
			Update("balance", gorm.Expr("balance - ?", amount)).Error
		if err != nil {
			return err
		}

		metric_transactions.WithLabelValues(guildID, "take")

		return err
	})
}

func SetCredits(db *gorm.DB, guildID, userID string, amount int, isBot bool) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := utils.ValidateTransaction(guildID, userID, amount); err != nil {
			return err
		}

		if err := utils.UpsertGuildMember(tx, guildID, userID); err != nil {
			return err
		}

		err := tx.Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "guild_id"}, {Name: "user_id"}},
			DoUpdates: clause.Assignments(map[string]interface{}{
				"balance": amount,
			}),
		}).Create(&database.GuildMemberCredit{
			GuildID: guildID,
			UserID:  userID,
			Balance: amount,
		}).Error

		metric_transactions.WithLabelValues(guildID, "set")

		return err
	})
}

func TransferCredits(db *gorm.DB, guildID, fromUserID, toUserID string, amount int, isBot bool) error {
	if fromUserID == toUserID {
		return err.ErrSameUser
	}

	return db.Transaction(func(tx *gorm.DB) error {
		if err := utils.ValidateTransaction(guildID, toUserID, amount); err != nil {
			return err
		}

		var sender database.GuildMemberCredit
		if err := tx.First(&sender, "guild_id = ? AND user_id = ?", guildID, fromUserID).Error; err != nil {
			return err
		}

		if sender.Balance < amount {
			return err.ErrInsufficientFunds
		}

		if err := utils.UpsertGuildMember(tx, guildID, toUserID); err != nil {
			return err
		}

		var recipient database.GuildMemberCredit
		err := tx.First(&recipient, "guild_id = ? AND user_id = ?", guildID, toUserID).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			recipient = database.GuildMemberCredit{
				GuildID: guildID,
				UserID:  toUserID,
				Balance: 0,
			}
			if err := tx.Create(&recipient).Error; err != nil {
				return err
			}
		} else if err != nil {
			return err
		}

		adjustedAmount := amount
		if recipient.Balance+amount > math.MaxInt {
			adjustedAmount = math.MaxInt - recipient.Balance
		}

		if adjustedAmount <= 0 {
			return errors.New("recipient cannot receive more credits without exceeding the maximum limit")
		}

		if err := tx.Model(&database.GuildMemberCredit{}).
			Where("guild_id = ? AND user_id = ?", guildID, fromUserID).
			Update("balance", gorm.Expr("balance - ?", adjustedAmount)).Error; err != nil {
			return err
		}

		err = tx.Model(&database.GuildMemberCredit{}).
			Where("guild_id = ? AND user_id = ?", guildID, toUserID).
			Update("balance", gorm.Expr("balance + ?", adjustedAmount)).Error
		metric_transactions.WithLabelValues(guildID, "set")
		return err
	})
}
