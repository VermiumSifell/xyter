package commands

import (
	"github.com/bwmarrin/discordgo"
	"github.com/knadh/koanf/v2"
	"gorm.io/gorm"
)

// HandlerFunc is the signature for handlers.
type HandlerFunc func(s *discordgo.Session, i *discordgo.InteractionCreate, k *koanf.Koanf, db *gorm.DB) error

// Registered top-level commands with nested groups/subcommands.
var topLevelCommands = map[string]*discordgo.ApplicationCommand{}

// Handlers lookup: parent -> group -> sub -> handler
// For subcommands without group, group key is empty string ""
var handlers = map[string]map[string]map[string]HandlerFunc{}

// RegisterCommand registers a command or subcommand at any depth.
// parent: top-level command name (e.g. "admin")
// group: command group name (empty string if none, e.g. "user")
// sub: subcommand name (required)
// option: the ApplicationCommandOption with params, name should match sub
// handler: handler function for this subcommand
func RegisterCommand(parent, group, sub string, option *discordgo.ApplicationCommandOption, handler HandlerFunc) {
	// Ensure parent command exists or create new
	if _, exists := topLevelCommands[parent]; !exists {
		topLevelCommands[parent] = &discordgo.ApplicationCommand{
			Name:        parent,
			Description: parent + " commands",
			Options:     []*discordgo.ApplicationCommandOption{},
		}
	}

	// Initialize handler maps
	if handlers[parent] == nil {
		handlers[parent] = map[string]map[string]HandlerFunc{}
	}
	if handlers[parent][group] == nil {
		handlers[parent][group] = map[string]HandlerFunc{}
	}

	// Register handler
	handlers[parent][group][sub] = handler

	cmd := topLevelCommands[parent]

	if group == "" {
		// Direct subcommand under parent
		// Check if option already exists, skip if yes (avoid duplicates)
		for _, opt := range cmd.Options {
			if opt.Name == sub {
				return
			}
		}
		cmd.Options = append(cmd.Options, option)
		return
	}

	// If group != "", find or create the group option under parent
	var groupOption *discordgo.ApplicationCommandOption
	for _, opt := range cmd.Options {
		if opt.Name == group && opt.Type == discordgo.ApplicationCommandOptionSubCommandGroup {
			groupOption = opt
			break
		}
	}
	if groupOption == nil {
		groupOption = &discordgo.ApplicationCommandOption{
			Type:        discordgo.ApplicationCommandOptionSubCommandGroup,
			Name:        group,
			Description: group + " command group",
			Options:     []*discordgo.ApplicationCommandOption{},
		}
		cmd.Options = append(cmd.Options, groupOption)
	}

	// Add the subcommand option inside the group, avoid duplicates
	for _, opt := range groupOption.Options {
		if opt.Name == sub {
			return
		}
	}
	groupOption.Options = append(groupOption.Options, option)
}

// GetTopLevelCommands returns all registered top-level commands.
func GetTopLevelCommands() []*discordgo.ApplicationCommand {
	cmds := []*discordgo.ApplicationCommand{}
	for _, cmd := range topLevelCommands {
		cmds = append(cmds, cmd)
	}
	return cmds
}

// GetHandler returns the handler func for given parent/group/sub combination.
// group can be empty string if none.
func GetHandler(parent, group, sub string) HandlerFunc {
	if grp, ok := handlers[parent]; ok {
		if subs, ok := grp[group]; ok {
			if h, ok := subs[sub]; ok {
				return h
			}
		}
	}
	return nil
}

// ResolveHandler extracts parent, group, subcommand from the interaction and returns the handler.
func ResolveHandler(i *discordgo.InteractionCreate) HandlerFunc {
	if i.Type != discordgo.InteractionApplicationCommand {
		return nil
	}

	data := i.ApplicationCommandData()
	parent := data.Name
	group := ""
	sub := ""

	if len(data.Options) > 0 {
		opt := data.Options[0]
		if opt.Type == discordgo.ApplicationCommandOptionSubCommand {
			sub = opt.Name
		} else if opt.Type == discordgo.ApplicationCommandOptionSubCommandGroup {
			group = opt.Name
			if len(opt.Options) > 0 {
				sub = opt.Options[0].Name
			}
		}
	}

	return GetHandler(parent, group, sub)
}
