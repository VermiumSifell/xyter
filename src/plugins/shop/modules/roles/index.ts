// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../../../logger";

import getEmbedConfig from "../../../../helpers/getEmbedConfig";

// Modules
import modules from "./modules";

import guildSchema from "../../../../database/schemas/guild";

// Function
export default {
  modules,

  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("roles")
      .setDescription("Shop for custom roles.")
      .addSubcommand(modules.buy.builder)
      .addSubcommand(modules.cancel.builder);
  },
  execute: async (interaction: CommandInteraction) => {
    if (interaction.guild == null) return;
    const { errorColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) return;

    if (!guildDB.shop.roles.status) {
      logger.silly(`Shop roles disabled.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":dollar: Shop - Roles",
            description: "This server has disabled shop roles.",
            color: errorColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    }

    if (options?.getSubcommand() === "buy") {
      logger.silly(`Executing buy subcommand`);

      await modules.buy.execute(interaction);
    }

    if (options?.getSubcommand() === "cancel") {
      logger.silly(`Executing cancel subcommand`);

      await modules.cancel.execute(interaction);
    }
  },
};
