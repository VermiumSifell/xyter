package commands

import "github.com/bwmarrin/discordgo"

func GetFullCommandName(i *discordgo.InteractionCreate) string {
	if i.Type != discordgo.InteractionApplicationCommand {
		return ""
	}

	data := i.ApplicationCommandData()
	name := data.Name

	if len(data.Options) == 0 {
		return name
	}

	opt := data.Options[0]

	switch opt.Type {
	case discordgo.ApplicationCommandOptionSubCommand:
		// parent + subcommand
		return name + " " + opt.Name

	case discordgo.ApplicationCommandOptionSubCommandGroup:
		// parent + group + subcommand
		if len(opt.Options) > 0 {
			return name + " " + opt.Name + " " + opt.Options[0].Name
		}
		return name + " " + opt.Name

	default:
		return name
	}
}
