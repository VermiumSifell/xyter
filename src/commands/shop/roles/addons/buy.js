const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

const {
  credits,
  apis,
  shopRoles,
  guilds,
} = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const { member } = interaction;

  const name = await interaction.options.getString('name');

  await interaction.guild.roles
    .create({
      name,
      color: 'RED',
      reason: `${interaction.member.id} bought from shop`,
    })
    .then(async (data) => {
      // Get guild object
      const guild = await guilds.findOne({
        guildId: interaction.member.guild.id,
      });

      const userObject = await credits.findOne({
        userId: member.id,
        guildId: interaction.member.guild.id,
      });
      const { pricePerHour } = guild.shop.roles;

      userObject.balance -= pricePerHour;

      shopRoles.create({
        roleId: data.id,
        userId: member.id,
        guildId: member.guild.id,
        pricePerHour,
        lastPayed: new Date(),
      });

      interaction.member.roles.add(data.id);
      shopRoles.find().then((data) => console.log(data));
    })
    .catch(console.error);

  await interaction.editReply({ content: 'Roles bought' });
};
