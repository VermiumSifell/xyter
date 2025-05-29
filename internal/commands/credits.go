package commands

import (
	"errors"
	"fmt"
	"log"
	"time"

	"git.zyner.org/meta/xyter/internal/database"
	"git.zyner.org/meta/xyter/internal/database/dal"
	"git.zyner.org/meta/xyter/internal/types/err"
	"git.zyner.org/meta/xyter/internal/utils"
	"github.com/bwmarrin/discordgo"
	"github.com/dromara/carbon/v2"
	"github.com/knadh/koanf/v2"
	"gorm.io/gorm"
)

// EchoCommand defines the Discord application command for /echo.
var CreditsCommand = &discordgo.ApplicationCommand{
	Name:        "credits",
	Description: "Manage your credits.",
	Options: []*discordgo.ApplicationCommandOption{
		{
			Name:        "bonus",
			Description: "Get bonuses",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "daily",
					Description: "Claim your daily treasure!",
				},
				{
					Name:        "weekly",
					Description: "Claim your weekly treasure!",
				},
				{
					Name:        "daily",
					Description: "Claim your monthly treasure!",
				},
			},
			Type: discordgo.ApplicationCommandOptionSubCommandGroup,
		},
	},
}

func init() {
	RegisterCommand("credits", "bonus", bonusDailyCmd.Name, bonusDailyCmd, BonusDailyHandler)
}

var bonusDailyCmd = &discordgo.ApplicationCommandOption{
	Type:        discordgo.ApplicationCommandOptionSubCommand,
	Name:        "daily",
	Description: "Claim your daily treasure!",
}

func BonusDailyHandler(s *discordgo.Session, i *discordgo.InteractionCreate, k *koanf.Koanf, db *gorm.DB) error {
	utils.DeferResponse(s, i)
	if i.Member.User.Bot {
		return err.ErrBotUser
	}
	guildID := i.GuildID
	userID := i.Member.User.ID
	if guildID == "" {
		utils.SendErrorEmbed(s, i, "Guild not found.")
		return nil
	}

	if userID == "" {
		utils.SendErrorEmbed(s, i, "User not found.")
		return nil
	}
	var cooldown database.Cooldown
	err := db.First(&cooldown, "guild_id = ? AND user_id = ?", guildID, userID).Error
	log.Println(cooldown)
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Println("inside if")
		err = utils.SendErrorEmbed(s, i, fmt.Sprintf("Sorry, but you're currently on cooldown. Please try again later.\n\nRemaining cooldown time: <t:%d:R>", cooldown.ExpiresAt.Unix()))
		return err
	}

	var settings database.GuildCreditsSettings

	// Fetch the settings again to get current data
	err = db.Where("guild_id = ?", guildID).First(&settings).Error
	if err != nil {
		utils.SendErrorEmbed(s, i, "Failed to fetch guild settings after upsert.")
		return nil
	}

	dailyBonus := settings.DailyBonusAmount

	dal.GiveCredits(db, guildID, userID, dailyBonus)
	balance, err := dal.GetBalance(db, guildID, userID)
	if err != nil {
		return err
	}

	embed := &discordgo.MessageEmbed{
		Title:     "\u2729 Daily Treasure Claimed",
		Color:     0x00ffcc, // customize or use config
		Author:    &discordgo.MessageEmbedAuthor{Name: "\u2729 Daily Treasure Claimed"},
		Thumbnail: &discordgo.MessageEmbedThumbnail{URL: i.Member.User.AvatarURL("")},
		Description: fmt.Sprintf("You've just claimed your daily treasure of **%d credits**! \U0001F389\n"+
			"Embark on an epic adventure and spend your riches wisely.\n\n\U0001F4B0 **Your balance**: %d credits",
			dailyBonus, balance),
		Footer: &discordgo.MessageEmbedFooter{
			Text:    fmt.Sprintf("Claimed by %s", i.Member.User.Username),
			IconURL: i.Member.User.AvatarURL(""),
		},
		Timestamp: time.Now().Format(time.RFC3339),
	}

	utils.SendEmbed(s, i, embed)

	// Set cooldown
	db.Create(&database.Cooldown{
		CooldownItem: "daily_bonus",
		GuildID:      &guildID,
		UserID:       &userID,
		ExpiresAt:    carbon.Now().AddDay().StartOfDay().StdTime(),
	})
	return nil
}
