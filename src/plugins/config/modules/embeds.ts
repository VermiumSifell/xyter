// Dependencies
import { ColorResolvable, CommandInteraction, Permissions } from "discord.js";

//Handlers
import logger from "@logger";

// Models
import guildSchema from "@schemas/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import getEmbedConfig from "@helpers/getEmbedConfig";

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
    // Destructure member
    const { guild, options } = interaction;

    if (guild == null) return;

    const embedConfig = await getEmbedConfig(guild);

    if (embedConfig == null) return;

    logger.info(embedConfig);

    // Get options
    const successColor = options?.getString("success-color") as ColorResolvable;
    const waitColor = options?.getString("wait-color") as ColorResolvable;
    const errorColor = options?.getString("error-color") as ColorResolvable;
    const footerIcon = options?.getString("footer-icon");
    const footerText = options?.getString("footer-text");

    // Get guild object
    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild is null`);
    }

    // Modify values
    guildDB.embeds.successColor =
      successColor !== null ? successColor : guildDB?.embeds?.successColor;
    guildDB.embeds.waitColor =
      waitColor !== null ? waitColor : guildDB?.embeds?.waitColor;
    guildDB.embeds.errorColor =
      errorColor !== null ? errorColor : guildDB?.embeds?.errorColor;
    guildDB.embeds.footerIcon =
      footerIcon !== null ? footerIcon : guildDB?.embeds?.footerIcon;
    guildDB.embeds.footerText =
      footerText !== null ? footerText : guildDB?.embeds?.footerText;

    // Save guild
    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild saved`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":tools: Settings - Guild [Credits]",
            description: `Credits settings updated.`,
            color: successColor || embedConfig.successColor,
            fields: [
              {
                name: "🤖 Success Color",
                value: `${guildDB?.embeds?.successColor}`,
                inline: true,
              },
              {
                name: "📈 Wait Color",
                value: `${guildDB?.embeds?.waitColor}`,
                inline: true,
              },
              {
                name: "📈 Error Color",
                value: `${guildDB?.embeds?.errorColor}`,
                inline: true,
              },
              {
                name: "🔨 Footer Icon",
                value: `${guildDB?.embeds?.footerIcon}`,
                inline: true,
              },
              {
                name: "⏰ Footer Text",
                value: `${guildDB?.embeds?.footerText}`,
                inline: true,
              },
            ],
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon || embedConfig.footerIcon,
              text: footerText || embedConfig.footerText,
            },
          },
        ],
      });
    });
  },
};
