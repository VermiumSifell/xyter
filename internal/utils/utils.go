package utils

import (
	"time"

	"git.zyner.org/meta/xyter/internal/database"
	"git.zyner.org/meta/xyter/internal/types/err"
	"github.com/bwmarrin/discordgo"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func CreateEmbed(title, description string, user *discordgo.User, color int) *discordgo.MessageEmbed {
	return &discordgo.MessageEmbed{
		Title:       title,
		Description: description,
		Color:       color,
		Timestamp:   time.Now().Format(time.RFC3339),
		Footer: &discordgo.MessageEmbedFooter{
			Text:    "Claimed by " + user.Username,
			IconURL: user.AvatarURL(""),
		},
		Thumbnail: &discordgo.MessageEmbedThumbnail{
			URL: user.AvatarURL(""),
		},
	}
}

func DeferResponse(s *discordgo.Session, i *discordgo.InteractionCreate) error {
	return s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
	})
}

func SendEmbed(s *discordgo.Session, i *discordgo.InteractionCreate, embed *discordgo.MessageEmbed) error {
	_, err := s.FollowupMessageCreate(i.Interaction, true, &discordgo.WebhookParams{
		Embeds: []*discordgo.MessageEmbed{embed},
	})
	return err
}

// SendErrorEmbed sends an error message as an embed to the user.
func SendErrorEmbed(s *discordgo.Session, i *discordgo.InteractionCreate, message string) error {
	embed := &discordgo.MessageEmbed{
		Title:       "Error",
		Description: message,
		Color:       0xFF0000, // Red color
	}
	_, err := s.FollowupMessageCreate(i.Interaction, true, &discordgo.WebhookParams{
		Embeds: []*discordgo.MessageEmbed{embed},
	})
	return err
}

// Uint64Ptr returns a pointer to the given uint64 value.
func Uint64Ptr(i uint64) *uint64 {
	return &i
}

func TopUsers(db *gorm.DB, guildID string, limit int) ([]database.GuildMemberCredit, error) {
	var topUsers []database.GuildMemberCredit
	err := db.Where("guild_id = ?", guildID).
		Order("balance DESC").
		Limit(limit).
		Find(&topUsers).Error
	return topUsers, err
}

func ValidateTransaction(guildID, userID string, amount int) error {
	if guildID == "" {
		return err.ErrNotGuild
	}
	if amount <= 0 {
		return err.ErrInvalidAmount
	}
	return nil
}

func UpsertGuildMember(db *gorm.DB, guildID, userID string) error {
	gm := database.GuildMember{
		GuildID: guildID,
		UserID:  userID,
	}
	return db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "guild_id"}, {Name: "user_id"}},
		DoNothing: true,
	}).Create(&gm).Error
}
