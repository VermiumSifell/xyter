import { CommandInteraction } from "discord.js";

export default async (interaction: CommandInteraction, currentCommand: any) => {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup(false);

  if (!subcommandGroup) {
    return currentCommand.modules[subcommand].metadata;
  }

  return currentCommand.groups[subcommandGroup].modules[subcommand].metadata;
};
