import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../../../../config.json';
import logger from '../../../../handlers/logger';
import { users, shopRoles, guilds } from '../../../../helpers/database/models';
import creditNoun from '../../../../helpers/creditNoun';

export default async (interaction) => {
  const { member } = interaction;
  const { guild } = member;

  const name = await interaction.options.getString('name');

  await interaction.guild.roles
    .create({
      name,
      color: 'RED',
      reason: `${interaction.member.id} bought from shop`,
    })
    .then(async (role) => {
      // Get guild object
      const guildDB = await guilds.findOne({
        guildId: interaction.member.guild.id,
      });

      const userDB = await users.findOne({
        userId: member.id,
        guildId: guild.id,
      });
      const { pricePerHour } = guildDB.shop.roles;

      userDB.credits -= pricePerHour;

      await userDB.save();

      await shopRoles.create({
        roleId: role.id,
        userId: member.id,
        guildId: guild.id,
        pricePerHour,
        lastPayed: new Date(),
      });

      member.roles.add(role.id);
      await shopRoles.find().then((role) => console.log(role));

      const embed = {
        title: ':shopping_cart: Shop - Roles [Buy]',
        description: `You have bought ${role.name} for ${guildDB.shop.roles.pricePerHour} per hour.`,
        color: config.colors.success,
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
    })
    .catch(console.error);
};
