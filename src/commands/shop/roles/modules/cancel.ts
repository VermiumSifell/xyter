// Dependencies
import {
  CommandInteraction,
  ColorResolvable,
  GuildMemberRoleManager,
} from 'discord.js';

// Configurations
import config from '../../../../../config.json';

// Models
import shopRolesSchema from '../../../../helpers/database/models/shopRolesSchema';

// Helpers
import creditNoun from '../../../../helpers/creditNoun';
import fetchUser from '../../../../helpers/fetchUser';

// Function
export default async (interaction: CommandInteraction) => {
  const { options, guild, user, member } = interaction;

  const optionRole = options.getRole('role');

  // If amount is null
  if (optionRole === null) {
    // Embed object
    const embed = {
      title: ':dollar: Shop - Roles [Cancel]' as string,
      description: 'We could not read your requested role.' as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  const roleExist = await shopRolesSchema?.find({
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
          title: ':shopping_cart: Shop - Roles [Cancel]' as string,
          description: `You have canceled ${optionRole.name}.` as string,
          color: config?.colors?.success as ColorResolvable,
          fields: [
            {
              name: 'Your balance' as string,
              value: `${creditNoun(userDB?.credits)}` as string,
            },
          ],
          timestamp: new Date() as Date,
          footer: {
            iconURL: config?.footer?.icon as string,
            text: config?.footer?.text as string,
          },
        };
        return interaction?.editReply({
          embeds: [embed],
        });
      })
      .catch(console.error);
  }
};
