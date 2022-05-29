import { CommandInteraction } from "discord.js";
import { ICommand } from "../../interfaces/Command";

export default async (
  interaction: CommandInteraction,
  currentCommand: ICommand
) => {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup(false);

  return subcommandGroup
    ? currentCommand.moduleData[subcommandGroup].moduleData[subcommand].metadata
    : currentCommand.moduleData[subcommand].metadata;
};
