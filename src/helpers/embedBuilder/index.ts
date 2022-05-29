import { footerText, footerIcon } from "../../config/embed";
import { MessageEmbed } from "discord.js";

export default new MessageEmbed()
  .setFooter({
    text: footerText,
    iconURL: footerIcon,
  })
  .setTimestamp(new Date());
