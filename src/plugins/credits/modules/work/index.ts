// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import timeoutSchema from "@schemas/timeout";

// Helpers
import fetchUser from "@helpers/fetchUser";
import fetchGuild from "@helpers/fetchGuild";
import i18next from "i18next";

export default {
  meta: { guildOnly: true, ephemeral: true },

  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, user, locale } = interaction;

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("credits:modules:work:general:title", {
          lng: locale,
          ns: "plugins",
        })
      )
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    // Chance module
    const chance = new Chance();

    // Check if user has a timeout
    const isTimeout = await timeoutSchema?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-03-15-19-16",
    });

    if (guild === null) {
      return logger?.verbose(`Guild is null`);
    }

    const guildDB = await fetchGuild(guild);

    // If user is not on timeout
    if (isTimeout) {
      logger?.verbose(`User ${user?.id} is on timeout`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:work:error01:description", {
                lng: locale,
                ns: "plugins",
                time: guildDB?.credits.workTimeout,
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    const creditsEarned = chance.integer({
      min: 0,
      max: guildDB?.credits?.workRate,
    });

    const userDB = await fetchUser(user, guild);

    if (userDB === null) {
      return logger?.verbose(`User not found`);
    }

    userDB.credits += creditsEarned;

    await userDB?.save()?.then(async () => {
      logger?.verbose(
        `User ${userDB?.userId} worked and earned ${creditsEarned} credits`
      );

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:work:success01:description", {
                lng: locale,
                ns: "plugins",
                time: guildDB?.credits.workTimeout,
                amount: creditsEarned,
              })
            )
            .setColor(successColor),
        ],
      });
    });

    // Create a timeout for the user
    await timeoutSchema?.create({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-03-15-19-16",
    });

    setTimeout(async () => {
      logger?.verbose(`Removing timeout for user ${user?.id}`);

      // When timeout is out, remove it from the database
      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-03-15-19-16",
      });
    }, guildDB?.credits?.workTimeout);
  },
};
