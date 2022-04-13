// Dependencies
import { CommandInteraction } from "discord.js";

import isCommand from "./isCommand";

export default {
  name: "interactionCreate",
  async execute(interaction: CommandInteraction) {
    await isCommand(interaction);
  },
};
