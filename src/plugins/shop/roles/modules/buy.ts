// Dependencies
import {
  CommandInteraction,
  ColorResolvable,
  GuildMemberRoleManager,
} from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";
// Models
import shopRolesSchema from "@schemas/shopRole";
import guildSchema from "@schemas/guild";

// Helpers
import pluralize from "@helpers/pluralize";
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  const { options, guild, user, member } = interaction;

  const optionName = options?.getString("name");
  const optionColor = options?.getString("color");

  // If amount is null
  if (optionName === null) {
    // Embed object
    const embed = {
      title: ":dollar: Shop - Roles [Buy]",
      description: "We could not read your requested name.",
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

  await guild?.roles
    .create({
      name: optionName,
      color: optionColor as ColorResolvable,
      reason: `${user?.id} bought from shop`,
    })
    .then(async (role) => {
      // Get guild object
      const guildDB = await guildSchema?.findOne({
        guildId: guild?.id,
      });

      const userDB = await fetchUser(user, guild);

      if (userDB === null) return;
      if (guildDB === null) return;
      if (guildDB.shop === null) return;

      const { pricePerHour } = guildDB.shop.roles;

      userDB.credits -= pricePerHour;

      await userDB?.save();

      await shopRolesSchema?.create({
        roleId: role?.id,
        userId: user?.id,
        guildId: guild?.id,
        pricePerHour,
        lastPayed: new Date(),
      });

      await (member?.roles as GuildMemberRoleManager)?.add(role?.id);

      const embed = {
        title: ":shopping_cart: Shop - Roles [Buy]",
        description: `You have bought ${role?.name} for ${guildDB?.shop?.roles?.pricePerHour} per hour.`,
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
};
