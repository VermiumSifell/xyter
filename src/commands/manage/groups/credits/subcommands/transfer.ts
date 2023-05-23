import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import checkPermission from "../../../../../helpers/checkPermission";
import deferReply from "../../../../../helpers/deferReply";
import economy from "../../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("transfer")
    .setDescription("Transfer credits from a user to another.")
    .addUserOption((option) =>
      option
        .setName("from-user")
        .setDescription("The user to take credits from.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to-user")
        .setDescription("The user to give credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to set.`)
        .setRequired(true)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const { guild, options, user } = interaction;

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  if (!guild) {
    throw new Error("We could not get the current guild from Discord.");
  }

  const fromUser = options.getUser("from-user");
  const toUser = options.getUser("to-user");
  const creditsAmount = options.getInteger("amount");

  if (!fromUser || !toUser || typeof creditsAmount !== "number") {
    throw new Error("Invalid user(s) or credit amount provided.");
  }

  const transactionResult = await economy.transfer(
    guild,
    fromUser,
    toUser,
    creditsAmount
  );

  // Constructing the transfer embed
  const transferEmbed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .addFields(
      { name: "📤 Sender", value: fromUser.username, inline: true },
      { name: "📥 Recipient", value: toUser.username, inline: true },
      {
        name: "💰 Transferred Amount",
        value: `${transactionResult.transferredAmount}`,
        inline: true,
      },
      {
        name: "🪙 Sender Balance",
        value: `${transactionResult.fromTransaction.balance}`,
        inline: true,
      },
      {
        name: "🪙 Recipient Balance",
        value: `${transactionResult.toTransaction.balance}`,
        inline: true,
      }
    )
    .setAuthor({ name: "This is an administrative action." })
    //.setThumbnail(user.displayAvatarURL())
    .setFooter({
      text: `Action by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  // Adding explanation if not all credits were transferred
  if (creditsAmount !== transactionResult.transferredAmount) {
    transferEmbed.setAuthor({
      name: `⚠️ Some credits could not be transferred.`,
    });
    const explanation = `*This is because the transfer amount exceeded the maximum allowed limit.*`;
    transferEmbed.setDescription(explanation);
  } else {
    transferEmbed.setAuthor({
      name: "✅ All credits have been successfully transferred.",
    });
  }

  await interaction.editReply({ embeds: [transferEmbed] });
};
