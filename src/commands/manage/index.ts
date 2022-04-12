//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ColorResolvable, Permissions } from "discord.js";

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
      // Embed object
      const embed = {
        title: ":toolbox: Admin" as string,
        color: colors?.error as ColorResolvable,
        description: "You do not have permission to manage this!" as string,
        timestamp: new Date(),
        footer: {
          iconURL: footer?.icon as string,
          text: footer?.text as string,
        },
      };

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    }

    if (options?.getSubcommandGroup() === "credits") {
      return credits.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "counters") {
      return counters.execute(interaction);
    }
  },
};
