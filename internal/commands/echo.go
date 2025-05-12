package commands

import (
	"fmt"

	"git.zyner.org/meta/xyter/internal/types"

	"github.com/bwmarrin/discordgo"
)

// EchoCommand defines the Discord application command for /echo.
var EchoCommand = &discordgo.ApplicationCommand{
	Name:        "echo",
	Description: "Echo back your input",
	Options: []*discordgo.ApplicationCommandOption{
		{
			Type:        discordgo.ApplicationCommandOptionString,
			Name:        "text",
			Description: "Text to echo",
			Required:    true,
		},
	},
}

// EchoHandler responds to the /echo command.
func EchoHandler(ctx *types.CommandContext) {
	options := ctx.Interaction.ApplicationCommandData().Options
	if len(options) == 0 {
		ctx.Respond("No text provided.")
		return
	}

	text := options[0].StringValue()
	response := fmt.Sprintf("You said: %s", text)
	err := ctx.Respond(response)
	if err != nil {
		// Handle the error as needed.
	}
}
