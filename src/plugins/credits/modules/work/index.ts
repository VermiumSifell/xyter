// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import timeoutSchema from "@schemas/timeout";

// Helpers
import fetchUser from "@helpers/fetchUser";
import fetchGuild from "@helpers/fetchGuild";

export default {
  meta: { guildOnly: true, ephemeral: true },

  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, user } = interaction;

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
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Work)")
            .setDescription(
              `You can not work while on timeout, please wait ${guildDB?.credits.workTimeout} seconds.`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
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
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Work)")
            .setDescription(`You worked and earned ${creditsEarned} credits`)
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
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
