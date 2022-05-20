// Dependencies
import { CommandInteraction, Permissions } from "discord.js";

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
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("welcome")
      .setDescription("Welcome")
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should welcome be enabled?")
      )
      .addChannelOption((option) =>
        option
          .setName("join-channel")
          .setDescription("Channel for join messages.")
          .addChannelTypes(ChannelType.GuildText)
      )

      .addChannelOption((option) =>
        option
          .setName("leave-channel")
          .setDescription("Channel for leave messages.")
          .addChannelTypes(ChannelType.GuildText)
      )

      .addStringOption((option) =>
        option
          .setName("leave-message")
          .setDescription("Message for leave messages.")
      )
      .addStringOption((option) =>
        option
          .setName("join-message")
          .setDescription("Message for join messages.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { options, guild } = interaction;

    // Get options
    const status = options?.getBoolean("status");
    const joinChannel = options?.getChannel("join-channel");
    const leaveChannel = options?.getChannel("leave-channel");
    const joinChannelMessage = options?.getString("join-message");
    const leaveChannelMessage = options?.getString("leave-message");

    // Get guild object
    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild not found in database.`);
    }

    // Modify values
    guildDB.welcome.status =
      status !== null ? status : guildDB?.welcome?.status;
    guildDB.welcome.joinChannel =
      joinChannel !== null ? joinChannel.id : guildDB?.welcome?.joinChannel;
    guildDB.welcome.leaveChannel =
      leaveChannel !== null ? leaveChannel.id : guildDB?.welcome?.leaveChannel;

    guildDB.welcome.joinChannelMessage =
      joinChannelMessage !== null
        ? joinChannelMessage
        : guildDB?.welcome?.joinChannelMessage;
    guildDB.welcome.leaveChannelMessage =
      leaveChannelMessage !== null
        ? leaveChannelMessage
        : guildDB?.welcome?.leaveChannelMessage;

    // Save guild
    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild welcome updated.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":hammer: Settings - Guild [Welcome]",
            description: `Welcome settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Status",
                value: `${guildDB?.welcome?.status}`,
                inline: true,
              },
              {
                name: "🌊 Join Channel",
                value: `${guildDB?.welcome?.joinChannel}`,
                inline: true,
              },
              {
                name: "🌊 Leave Channel",
                value: `${guildDB?.welcome?.leaveChannel}`,
                inline: true,
              },
              {
                name: "📄 Join Channel Message",
                value: `${guildDB?.welcome?.joinChannelMessage}`,
                inline: true,
              },
              {
                name: "📄 Leave Channel Message",
                value: `${guildDB?.welcome?.leaveChannelMessage}`,
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
