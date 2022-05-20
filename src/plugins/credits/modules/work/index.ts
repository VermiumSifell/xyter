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

export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, user } = interaction;

    const embed = new MessageEmbed()
      .setTitle("[:dollar:] Work")
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
      return logger?.silly(`Guild is null`);
    }

    const guildDB = await fetchGuild(guild);

    // If user is not on timeout
    if (isTimeout) {
      logger?.silly(`User ${user?.id} is on timeout`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `You are on timeout, please wait ${guildDB?.credits.workTimeout} seconds.`
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
      return logger?.silly(`User not found`);
    }

    userDB.credits += creditsEarned;

    await userDB?.save()?.then(async () => {
      logger?.silly(
        `User ${userDB?.userId} worked and earned ${creditsEarned} credits`
      );

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(`You worked and earned ${creditsEarned} credits.`)
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
      logger?.silly(`Removing timeout for user ${user?.id}`);

      // When timeout is out, remove it from the database
      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-03-15-19-16",
      });
    }, guildDB?.credits?.workTimeout);
  },
};
