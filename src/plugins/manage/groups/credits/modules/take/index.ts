// Dependencies
import { CommandInteraction, MessageEmbed, Permissions } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Helpers
import pluralize from "@helpers/pluralize";

// Models
import fetchUser from "@helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("take")
      .setDescription("Take credits from a user.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to take credits from.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription(`The amount of credits to take.`)
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { guild, options } = interaction;

    // User option
    const optionUser = options?.getUser("user");

    // Amount option
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      logger?.verbose(`Amount is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide an amount.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger?.verbose(`Amount is zero or below`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide an amount greater than zero.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (optionUser === null) {
      logger?.verbose(`Discord receiver is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide a user.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (guild === null) {
      logger?.verbose(`Guild is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must be in a guild.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // toUser Information
    const toUser = await fetchUser(optionUser, guild);

    // If toUser does not exist
    if (toUser === null) {
      logger?.verbose(`ToUser is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`The user you provided does not exist.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (toUser?.credits === null) {
      logger?.verbose(`ToUser.credits is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`The user you provided does not have credits.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Withdraw amount from toUser
    toUser.credits -= optionAmount;

    // Save toUser
    await toUser?.save()?.then(async () => {
      logger?.verbose(`Saved toUser`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(
              `Took ${pluralize(optionAmount, "credit")} from ${optionUser}.`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
  },
};
