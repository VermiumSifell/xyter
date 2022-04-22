import { successColor, footerText, footerIcon } from "@config/embed";

import axios from "axios";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import logger from "@logger";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("meme").setDescription("Get a meme from r/memes)");
  },
  execute: async (interaction: CommandInteraction) => {
    await axios
      .get("https://www.reddit.com/r/memes/random/.json")
      .then(async (res) => {
        const response = res.data[0].data.children;
        const content = response[0].data;

        const embed = new MessageEmbed()
          .setTitle(content.title)
          .setTimestamp(new Date())
          .setImage(content.url)
          .setFooter({
            text: `👍 ${content.ups}︱👎 ${content.downs}\n${footerText}`,
            iconURL: footerIcon,
          })
          .setColor(successColor);

        return interaction.editReply({ embeds: [embed] });
      })
      .catch((error) => {
        logger.error(`${error}`);
      });
  },
};
