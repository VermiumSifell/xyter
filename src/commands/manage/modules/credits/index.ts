import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import logger from "../../../../logger";

import modules from "./modules";

export const moduleData = modules;

export const builder = (group: SlashCommandSubcommandGroupBuilder) => {
  return group
    .setName("credits")
    .setDescription("Manage the credits of a user.")
    .addSubcommand(modules.give.builder)
    .addSubcommand(modules.set.builder)
    .addSubcommand(modules.take.builder)
    .addSubcommand(modules.transfer.builder)
    .addSubcommand(modules.drop.builder);
};

export const execute = async (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "give":
      return modules.give.execute(interaction);
    case "set":
      return modules.set.execute(interaction);
    case "take":
      return modules.take.execute(interaction);
    case "transfer":
      return modules.transfer.execute(interaction);
    case "drop":
      return modules.drop.execute(interaction);
  }
};
