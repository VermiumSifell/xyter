// Dependencies
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";
// Models
import shopRolesSchema from "@schemas/shopRole";

// Helpers
import pluralize from "@helpers/pluralize";
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  const { options, guild, user, member } = interaction;

  const optionRole = options.getRole("role");

  // If amount is null
  if (optionRole === null) {
    // Embed object
    const embed = {
      title: ":dollar: Shop - Roles [Cancel]",
      description: "We could not read your requested role.",
      color: errorColor,
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };

    // Send interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  const roleExist = await shopRolesSchema?.findOne({
    guildId: guild?.id,
    userId: user?.id,
    roleId: optionRole?.id,
  });

  if (roleExist) {
    await (member?.roles as GuildMemberRoleManager)?.remove(optionRole?.id);

    await guild?.roles
      .delete(optionRole?.id, `${user?.id} canceled from shop`)
      .then(async () => {
        const userDB = await fetchUser(user, guild);

        if (userDB === null) return;

        await shopRolesSchema?.deleteOne({
          roleId: optionRole?.id,
          userId: user?.id,
          guildId: guild?.id,
        });

        const embed = {
          title: ":shopping_cart: Shop - Roles [Cancel]",
          description: `You have canceled ${optionRole.name}.`,
          color: successColor,
          fields: [
            {
              name: "Your balance",
              value: `${pluralize(userDB?.credits, "credit")}`,
            },
          ],
          timestamp: new Date(),
          footer: {
            iconURL: footerIcon,
            text: footerText,
          },
        };
        return interaction?.editReply({
          embeds: [embed],
        });
      })
      .catch(console.error);
  }
};
