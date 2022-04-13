// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

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

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give credits to a user")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to pay.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount you will pay.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { guild, user, options } = interaction;

    const discordReceiver = options?.getUser("user");
    const creditAmount = options?.getInteger("amount");

    // If amount option is null
    if (creditAmount === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(`We could not read your requested amount!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is zero or below
    if (creditAmount <= 0) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(`You can not give zero credits or below!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (discordReceiver === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(`We could not read receiver user!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (guild === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(`We could not read your guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const toUser = await fetchUser(discordReceiver, guild);

    if (toUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(
              `We could not read your receiver user from our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (toUser?.credits === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(
              `We could not find credits for ${discordReceiver} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Deposit amount to toUser
    toUser.credits += creditAmount;

    // Save toUser
    await toUser?.save()?.then(async () => {
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} gave ${
          discordReceiver?.id
        } ${pluralize(creditAmount, "credit")}.`
      );

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(
              `We have given ${discordReceiver}, ${pluralize(
                creditAmount,
                "credit"
              )}.`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
  },
};
