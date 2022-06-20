import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import modules from "../../commands/counters/modules";

export const builder = new SlashCommandBuilder()
  .setName("counters")
  .setDescription("View guild counters")

  .addSubcommand(modules.view.builder);

export const moduleData = modules;

export const execute = async (interaction: CommandInteraction) => {
  if (interaction.options.getSubcommand() === "view") {
    await modules.view.execute(interaction);
  }
};
