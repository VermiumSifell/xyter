// Dependencies
import { CommandInteraction } from "discord.js";

import isCommand from "@root/events/interactionCreate/components/isCommand";

export default {
  name: "interactionCreate",
  async execute(interaction: CommandInteraction) {
    await isCommand(interaction);
  },
};
