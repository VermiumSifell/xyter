// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import guildSchema from "@schemas/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("shop")
      .setDescription("Shop")
      .addBooleanOption((option) =>
        option
          .setName("roles-status")
          .setDescription("Should roles be enabled?")
      )
      .addNumberOption((option) =>
        option
          .setName("roles-price-per-hour")
          .setDescription("Price per hour for roles.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { options, guild } = interaction;

    // Get options
    const rolesStatus = options?.getBoolean("roles-status");
    const rolesPricePerHour = options?.getNumber("roles-price-per-hour");

    // Get guild object
    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.verbose(`Guild not found in database.`);
    }

    // Modify values
    guildDB.shop.roles.status =
      rolesStatus !== null ? rolesStatus : guildDB?.shop?.roles?.status;
    guildDB.shop.roles.pricePerHour =
      rolesPricePerHour !== null
        ? rolesPricePerHour
        : guildDB?.shop?.roles?.pricePerHour;

    // Save guild
    await guildDB?.save()?.then(async () => {
      logger?.verbose(`Guild shop updated.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":hammer: Settings - Guild [Shop]",
            description: `Shop settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Roles Status",
                value: `${guildDB?.shop?.roles.status}`,
                inline: true,
              },
              {
                name: "🌊 Roles Price Per Hour",
                value: `${guildDB?.shop?.roles.pricePerHour}`,
                inline: true,
              },
            ],
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });
  },
};
