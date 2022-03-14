const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { credits, apis } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const name = interaction.options.getString('name');

  guild.roles
    .create({
      data: {
        name,
        color: 'BLUE',
      },
      reason: `${interaction.member.id} bought from shop`,
    })
    .then(console.log)
    .catch(console.error);

  interaction.editReply({ content: 'Roles' });
};
