//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  ColorResolvable,
  Permissions,
  MessageEmbed,
} from "discord.js";

// Configurations
import { colors, footer } from "../../../config.json";

// Groups
import credits from "./groups/credits";
import counters from "./groups/counters";

// Function
export default {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Manage your guild.")
    .addSubcommandGroup(counters.data)
    .addSubcommandGroup(credits.data),

  async execute(interaction: CommandInteraction) {
    // Destructure
    const { memberPermissions, options } = interaction;

    // Check permission
    if (!memberPermissions?.has(Permissions?.FLAGS?.MANAGE_GUILD)) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage")
            .setDescription(`You do not have permission to manage this!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    if (options?.getSubcommandGroup() === "credits") {
      return credits.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "counters") {
      return counters.execute(interaction);
    }
  },
};
