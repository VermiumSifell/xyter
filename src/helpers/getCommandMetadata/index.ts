import { CommandInteraction } from "discord.js";
import { ICommand } from "@interface/Command";

export default async (
  interaction: CommandInteraction,
  currentCommand: ICommand
) => {
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup(false);

  return subcommandGroup
    ? currentCommand.modules[subcommandGroup].modules[subcommand].metadata
    : currentCommand.modules[subcommand].metadata;
};
