// 3rd party dependencies
import { CommandInteraction } from "discord.js";

// Dependencies
import isCommand from "@root/events/interactionCreate/components/isCommand";

export default {
  name: "interactionCreate",
  async execute(interaction: CommandInteraction) {
    await isCommand(interaction);
  },
};
