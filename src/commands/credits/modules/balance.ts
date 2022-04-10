// Dependencies
import { CommandInteraction, ColorResolvable } from 'discord.js';

// Configurations
import config from '../../../../config.json';

// Helpers
import creditNoun from '../../../helpers/creditNoun';

// Models
import userSchema from '../../../helpers/database/models/userSchema';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, user, guild } = interaction;

  // User option
  const optionUser = options?.getUser('user');

  // Get credit object
  const userDB = await userSchema?.findOne({
    userId: optionUser ? optionUser?.id : user?.id,
    guildId: guild?.id,
  });

  // If userDB does not exist
  if (!userDB) {
    // Embed object
    const embed = {
      title: ':dollar: Credits [Balance]' as string,
      description: `We can not find ${
        optionUser || 'you'
      } in our database.` as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  // If userDB.credits does not exist
  if (!userDB.credits) {
    // Embed object
    const embed = {
      title: ':dollar: Credits [Balance]' as string,
      description: `We can not find credits for ${
        optionUser || 'you'
      } in our database.` as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  } else {
    // Embed object
    const embed = {
      title: ':dollar: Credits [Balance]' as string,
      description: `${
        optionUser ? `${optionUser} has` : 'You have'
      } ${creditNoun(userDB.credits)}.` as string,
      color: config?.colors?.success as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }
};
