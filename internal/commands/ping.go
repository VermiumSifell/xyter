package commands

import (
	"git.zyner.org/meta/xyter/internal/types"

	"github.com/bwmarrin/discordgo"
)

// PingCommand defines the Discord application command for /ping.
var PingCommand = &discordgo.ApplicationCommand{
	Name:        "ping",
	Description: "Replies with Pong!",
}

// PingHandler responds to the /ping command.
func PingHandler(ctx *types.CommandContext) {
	err := ctx.Respond("Pong!")
	if err != nil {
		// In production, you might log errors or provide additional error handling.
	}
}
