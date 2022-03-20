import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../../../config.json';
import logger from '../../../handlers/logger';
import { guilds, users } from '../../../helpers/database/models';
import creditNoun from '../../../helpers/creditNoun';

export default async (interaction) => {
  const name = interaction.options.getString('name');

  const { member } = interaction;
  const { guild } = member;

  const guildDB = await guilds.findOne({ guildId: guild.id });
  const userDB = await users.findOne({ userId: member.id, guildId: guild.id });

  guild.roles
    .create({
      data: {
        name,
        color: 'BLUE',
      },
      reason: `${interaction.member.id} bought from shop`,
    })
    .then(async (role) => {
      console.log(role);
      userDB.credits -= guildDB.shop.roles.pricePerHour;
      await userDB.save().then(async () => {
        const embed = {
          title: ':shopping_cart: Shop - Roles',
          description: `You have bought ${role.name} for ${guildDB.shop.roles.pricePerHour} per hour.`,
          color: config.colors.error,
          fields: [
            { name: 'Your balance', value: `${creditNoun(userDB.credits)}` },
          ],
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
      });
    })
    .catch(console.error);
};
