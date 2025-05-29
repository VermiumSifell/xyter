package bot

import (
	"log"

	"git.zyner.org/meta/xyter/internal/commands"
	"git.zyner.org/meta/xyter/internal/database"
	"git.zyner.org/meta/xyter/internal/utils"
	"github.com/bwmarrin/discordgo"
	"github.com/knadh/koanf/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Start initializes the Discord session, registers interaction handlers, and creates commands.
func Start(k *koanf.Koanf, db *gorm.DB) (*discordgo.Session, error) {
	// Create a new Discord session using the provided bot token.
	s, err := discordgo.New("Bot " + k.String("bot/token"))
	if err != nil {
		return nil, err
	}

	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		guildID := i.GuildID
		userID := i.Member.User.ID
		guild := database.Guild{ID: guildID}
		if err := db.FirstOrCreate(&guild, database.Guild{ID: guildID}).Error; err != nil {
			utils.SendErrorEmbed(s, i, "Failed to create or find guild.")
			return
		}
		user := database.User{ID: userID}
		if err := db.FirstOrCreate(&user, database.User{ID: userID}).Error; err != nil {
			utils.SendErrorEmbed(s, i, "Failed to create or find guild.")
			return
		}

		// Upsert GuildCreditsSettings

		settings := database.GuildCreditsSettings{
			GuildID:          guildID,
			DailyBonusAmount: 25, // default
		}

		err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "guild_id"}},                                    // conflict on guild_id
			DoNothing: false,                                                                  // do update, not nothing
			DoUpdates: clause.AssignmentColumns([]string{"daily_bonus_amount", "updated_at"}), // fields to update on conflict
		}).Create(&settings).Error

		if err != nil {
			utils.SendErrorEmbed(s, i, "Failed to upsert guild settings.")
			return
		}

		handler := commands.ResolveHandler(i)
		if handler != nil {
			handler(s, i, k, db)
		} else {
			// unknown command handler or reply with error
			log.Printf("Couldn't find handler for command %q, this should be impossible. Trying to recover by removing the command.", commands.GetFullCommandName(i))
			err := s.ApplicationCommandDelete(k.String("bot/app-id"), i.GuildID, i.ApplicationCommandData().ID)
			if err != nil {
				log.Fatalf("Failed to remove command. Impossible scenario. Bailing out, goodbye!\n%v", err)
			} else {
				log.Printf("Command was successfully removed!")
			}
		}
	})

	log.Println("Registering slash commands...")
	for _, cmd := range commands.GetTopLevelCommands() {
		_, err := s.ApplicationCommandCreate(k.String("bot/app-id"), k.String("bot/guild-id"), cmd)
		if err != nil {
			log.Printf("Error creating command %q: %v", cmd.Name, err)
		}
	}

	// Open a connection to Discord.
	if err := s.Open(); err != nil {
		return nil, err
	}

	log.Println("Bot is up and running.")
	return s, nil
}
