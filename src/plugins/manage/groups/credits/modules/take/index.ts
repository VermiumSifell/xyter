// Dependencies
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";

// Configurations
import { colors, footer } from "../../../../../../../config.json";

// Handlers
import logger from "../../../../../../logger";

// Helpers
import pluralize from "../../../../../../helpers/pluralize";

// Models
import fetchUser from "../../../../../../helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("take")
      .setDescription("Take credits from a user")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to take credits from.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount you will take.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { guild, user, options } = interaction;

    // User option
    const optionUser = options?.getUser("user");

    // Amount option
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`We could not read your requested amount!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`We could not take zero credits or below!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    if (optionUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`We could not read your requested user!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }
    if (guild === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`We could not read your guild!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    // toUser Information
    const toUser = await fetchUser(optionUser, guild);

    // If toUser does not exist
    if (toUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(
              `We could not read your requested user from our database!`
            )
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (toUser?.credits === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(
              `We could not find credits for ${optionUser} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    // Withdraw amount from toUser
    toUser.credits -= optionAmount;

    // Save toUser
    await toUser?.save()?.then(async () => {
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} set ${
          optionUser?.id
        } to ${pluralize(optionAmount, "credit")}.`
      );

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(
              `We have taken ${pluralize(
                optionAmount,
                "credit"
              )} from ${optionUser}.`
            )
            .setTimestamp(new Date())
            .setColor(colors?.success as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    });
  },
};
