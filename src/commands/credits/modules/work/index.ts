// Dependencies
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";
import Chance from "chance";

// Configurations
import { colors, footer } from "../../../../../config.json";

// Handlers
import logger from "../../../../logger";

// Models
import timeouts from "../../../../database/schemas/timeout";

// Helpers
import pluralize from "../../../../helpers/pluralize";
import fetchUser from "../../../../helpers/fetchUser";
import fetchGuild from "../../../../helpers/fetchGuild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription("Work for credits.");
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, user } = interaction;

    // Chance module
    const chance = new Chance();

    // Check if user has a timeout
    const isTimeout = await timeouts?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-03-15-19-16",
    });

    if (guild === null) return;

    const guildDB = await fetchGuild(guild);

    // If user is not on timeout
    if (!isTimeout) {
      const creditsEarned = chance.integer({
        min: 0,
        max: guildDB?.credits?.workRate,
      });

      const userDB = await fetchUser(user, guild);

      if (userDB === null) return;

      userDB.credits += creditsEarned;

      await userDB?.save()?.then(async () => {
        logger?.verbose(`Credits added to user: ${user?.id}`);

        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:dollar:] Credits (Work)")
              .setDescription(
                `You have earned ${pluralize(creditsEarned, "credit")}.`
              )
              .setTimestamp(new Date())
              .setColor(colors?.success as ColorResolvable)
              .setFooter({ text: footer?.text, iconURL: footer?.icon }),
          ],
        });
      });

      // Create a timeout for the user
      await timeouts?.create({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-03-15-19-16",
      });

      setTimeout(async () => {
        logger?.verbose(
          `Guild: ${guild?.id} User: ${
            user?.id
          } has not worked within the last ${
            guildDB?.credits?.workTimeout / 1000
          } seconds, work can be done`
        );

        // When timeout is out, remove it from the database
        await timeouts?.deleteOne({
          guildId: guild?.id,
          userId: user?.id,
          timeoutId: "2022-03-15-19-16",
        });
      }, guildDB?.credits?.workTimeout);
    } else {
      // Send debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has worked within last day, no work can be done`
      );

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Work)")
            .setDescription(
              `You have worked within the last ${
                guildDB?.credits?.workTimeout / 1000
              } seconds, you can not work now!`
            )
            .setTimestamp(new Date())
            .setColor(colors?.success as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }
  },
};
