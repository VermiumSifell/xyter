import { CommandInteraction } from "discord.js";

export const metadata = { guildOnly: false, ephemeral: false };

export const execute = async (interaction: CommandInteraction) => {
  console.log("primary button clicked!");
};
