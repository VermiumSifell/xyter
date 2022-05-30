// Dependencies
import { CommandInteraction, MessageEmbed, Permissions } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import apiSchema from "../../../../../../models/api";
import encryption from "../../../../../../handlers/encryption";

// Configurations
import getEmbedConfig from "../../../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../../../logger";

// Helpers
import pluralize from "../../../../../../helpers/pluralize";

// Models
import fetchUser from "../../../../../../helpers/fetchUser";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("drop")
      .setDescription("Drop some credits for specified amount of users.")
      .addIntegerOption((option) =>
        option
          .setName("uses")
          .setDescription("How many users should be able to use this.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("credit")
          .setDescription(`How much credits provided per use.`)
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send the message to.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    if (interaction.guild == null) return;
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild); // Destructure
    const { guild, options } = interaction;

    const uses = options?.getInteger("uses");
    const creditAmount = options?.getInteger("credit");
    const channel = options?.getChannel("channel");

    if (!uses) throw new Error("Amount of uses is required.");
    if (!creditAmount) throw new Error("Amount of credits is required.");
    if (!channel) throw new Error("Channel is required.");

    const embed = new MessageEmbed()
      .setTitle("[:toolbox:] Drop")
      .setFooter({ text: footerText, iconURL: footerIcon });

    const code = uuidv4();

    const apiCredentials = await apiSchema?.findOne({
      guildId: guild?.id,
    });

    if (!apiCredentials) return;

    const api = axios?.create({
      baseURL: apiCredentials.url,
      headers: {
        Authorization: `Bearer ${encryption.decrypt(apiCredentials.token)}`,
      },
    });

    const shopUrl = apiCredentials?.url?.replace("/api", "/store");

    await api
      .post("vouchers", {
        uses,
        code,
        credits: creditAmount,
        memo: `${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
      })
      .then(async () => {
        await interaction.editReply({
          embeds: [
            embed
              .setColor(successColor)
              .setDescription(`Successfully crated code: ${code}`),
          ],
        });

        const discordChannel = guild.channels.cache.get(channel.id);

        if (!discordChannel) return;

        if (discordChannel.type !== "GUILD_TEXT") return;

        discordChannel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("[:parachute:] Code Drop!")
              .addFields([
                { name: "Code", value: `${code}`, inline: true },
                { name: "Amount", value: `${creditAmount}`, inline: true },
                { name: "Uses", value: `${uses}`, inline: true },
              ])
              .setDescription(
                `${interaction.user} dropped a voucher! You can use the code [here](${shopUrl})!`
              )
              .setColor(successColor),
          ],
        });
      });
  },
};
