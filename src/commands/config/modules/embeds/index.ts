// Dependencies
import {
  ColorResolvable,
  CommandInteraction,
  MessageEmbed,
  Permissions,
} from "discord.js";

//Handlers
import logger from "../../../../logger";

// Models
import guildSchema from "../../../../models/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import getValues from "./components/getValues";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("embeds")
      .setDescription(`Embeds`)
      .addStringOption((option) =>
        option
          .setName("success-color")
          .setDescription("No provided description")
      )
      .addStringOption((option) =>
        option.setName("wait-color").setDescription("No provided description")
      )
      .addStringOption((option) =>
        option.setName("error-color").setDescription("No provided description")
      )
      .addStringOption((option) =>
        option.setName("footer-icon").setDescription("No provided description")
      )
      .addStringOption((option) =>
        option.setName("footer-text").setDescription("No provided description")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { guild } = interaction;
    if (!guild) throw new Error("Guild not found");

    const { successColor, waitColor, errorColor, footerText, footerIcon } =
      await getValues(interaction);

    // Initialize embed object
    const embed = new MessageEmbed()
      .setTitle("[:tools:] Embeds")
      .setFooter({ text: footerText, iconURL: footerIcon })
      .setTimestamp(new Date());

    // Get guild values
    const guildData = await guildSchema.findOne({
      guildId: guild.id,
    });
    if (!guildData) throw new Error("Guild data not found");

    await guildData.save().then(async () => {
      embed
        .setDescription("Following embed configuration will be used.")
        .setColor(successColor)
        .addFields([
          {
            name: "🟢 Success Color",
            value: `${successColor}`,
            inline: true,
          },
          {
            name: "🟡 Wait Color",
            value: `${waitColor}`,
            inline: true,
          },
          {
            name: "🔴 Error Color",
            value: `${errorColor}`,
            inline: true,
          },
          {
            name: "🖼️ Footer Icon",
            value: `${footerIcon}`,
            inline: true,
          },
          {
            name: "📄 Footer Text",
            value: `${footerText}`,
            inline: true,
          },
        ]);

      return interaction.editReply({
        embeds: [embed],
      });
    });
  },
};
