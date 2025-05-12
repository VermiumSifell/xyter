package bot

import (
	"github.com/bwmarrin/discordgo"

	"git.zyner.org/meta/xyter/internal/commands"
)

// GetCommands returns a slice of ApplicationCommand definitions.
func GetCommands() []*discordgo.ApplicationCommand {
	return []*discordgo.ApplicationCommand{
		commands.PingCommand,
		commands.EchoCommand,
	}
}

// RegisterHandlers maps command names to their corresponding handler functions.
func RegisterHandlers() {
	// The router (a simple map) is defined in router.go.
	RegisterCommand("ping", commands.PingHandler)
	RegisterCommand("echo", commands.EchoHandler)
}
