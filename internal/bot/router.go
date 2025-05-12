package bot

import (
	"git.zyner.org/meta/xyter/internal/types"

	"github.com/bwmarrin/discordgo"
)

// HandlerFunc defines the signature of a slash command handler.
type HandlerFunc func(ctx *types.CommandContext)

// router maps command names to handler functions.
var router = map[string]HandlerFunc{}

// RegisterCommand registers a command handler with the router.
func RegisterCommand(name string, handler HandlerFunc) {
	router[name] = handler
}

// InteractionHandler dispatches incoming interactions to the appropriate command handler.
func InteractionHandler(s *discordgo.Session, i *discordgo.InteractionCreate) {
	// We only care about ApplicationCommand interactions
	if i.Type != discordgo.InteractionApplicationCommand {
		return
	}

	if handler, exists := router[i.ApplicationCommandData().Name]; exists {
		ctx := &types.CommandContext{Session: s, Interaction: i}
		handler(ctx)
	}
}
