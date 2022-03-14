const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

const { credits, apis } = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const name = interaction.options.getString('name');

  interaction.editReply({ content: 'Roles canceled' });
};
