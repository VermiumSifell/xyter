package types

import "github.com/bwmarrin/discordgo"

// CommandContext wraps the discordgo session and incoming interaction.
// It gives handlers a consistent interface to respond to commands.
type CommandContext struct {
	Session     *discordgo.Session
	Interaction *discordgo.InteractionCreate
}

// Respond sends a basic reply back to the user.
func (ctx *CommandContext) Respond(content string) error {
	return ctx.Session.InteractionRespond(ctx.Interaction.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: content,
		},
	})
}
