package bot

import (
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/knadh/koanf/v2"
)

// Start initializes the Discord session, registers interaction handlers, and creates commands.
func Start(k *koanf.Koanf) (*discordgo.Session, error) {
	// Create a new Discord session using the provided bot token.
	s, err := discordgo.New("Bot " + k.String("bot/token"))
	if err != nil {
		return nil, err
	}

	// Register the central handler for interactions.
	s.AddHandler(InteractionHandler)

	// Open a connection to Discord.
	if err := s.Open(); err != nil {
		return nil, err
	}

	// Register commands and handlers.
	RegisterHandlers()

	log.Println("Registering slash commands...")
	for _, cmd := range GetCommands() {
		_, err := s.ApplicationCommandCreate(k.String("bot/app-id"), k.String("bot/guild-id"), cmd)
		if err != nil {
			log.Printf("Error creating command %q: %v", cmd.Name, err)
		}
	}

	log.Println("Bot is up and running.")
	return s, nil
}
