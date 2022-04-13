//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions, MessageEmbed } from "discord.js";

// Configurations
import { errorColor, footerText, footerIcon } from "@config/embed";

// Groups
import credits from "./groups/credits";
import counters from "./groups/counters";

// Function
export default {
  metadata: { author: "Zyner" },
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
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
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
