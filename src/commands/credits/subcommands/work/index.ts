import Chance from "chance";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import economy from "../../../../modules/credits";
import jobs from "./jobs";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("work")
    .setDescription("Put in the hustle and earn some credits!");
};

const fallbackEmoji = "💼"; // Fallback work emoji

export const execute = async (interaction: CommandInteraction) => {
  const { guild, user } = interaction;

  await deferReply(interaction, false);

  if (!guild) {
    throw new Error(
      "Oops! It seems like you're not part of a guild. Join a guild to use this command!"
    );
  }

  if (!user) {
    throw new Error(
      "Oops! It looks like we couldn't find your user information. Please try again or contact support for assistance."
    );
  }

  const chance = new Chance();

  const getRandomWork = () => {
    return chance.pickone(jobs);
  };

  const baseCreditsRate = getRandomWork().creditsRate; // Get the base rate of credits earned per work action
  const bonusChance = 30; // Higher chance of earning a bonus
  const penaltyChance = 10; // Lower chance of receiving a penalty

  const baseCreditsEarned = chance.integer({ min: 1, max: baseCreditsRate }); // Generate a random base number of credits earned

  let bonusCredits = 0; // Initialize bonus credits
  let penaltyCredits = 0; // Initialize penalty credits
  let creditsEarned = baseCreditsEarned; // Set the initial earned credits to the base amount
  let work;

  if (chance.bool({ likelihood: bonusChance })) {
    // Earn bonus credits
    const bonusMultiplier = chance.floating({ min: 1.1, max: 1.5 }); // Get a random multiplier for the bonus credits
    bonusCredits = Math.ceil(baseCreditsEarned * bonusMultiplier); // Calculate the bonus credits
    creditsEarned = baseCreditsEarned + bonusCredits; // Update the total earned credits
    work = getRandomWork(); // Get a random work type
  } else if (chance.bool({ likelihood: penaltyChance })) {
    // Receive a penalty
    const penaltyMultiplier = chance.floating({ min: 0.5, max: 0.8 }); // Get a random multiplier for the penalty credits
    penaltyCredits = Math.ceil(baseCreditsEarned * penaltyMultiplier); // Calculate the penalty credits
    creditsEarned = baseCreditsEarned - penaltyCredits; // Update the total earned credits
    work = getRandomWork(); // Get a random work type
  } else {
    // Earn base credits
    work = getRandomWork(); // Get a random work type
  }

  // Descriptions
  const descriptions = [];

  // Work Description
  descriptions.push(
    `Mission complete! You've earned **${baseCreditsEarned} credits**! 🎉`
  );

  // Bonus Description
  if (bonusCredits > 0) {
    descriptions.push(`💰 Bonus: **${bonusCredits} credits**!`);
  }

  // Penalty Description
  if (penaltyCredits !== 0) {
    descriptions.push(`😱 Penalty: **${penaltyCredits} credits** deducted.`);
  }

  // Total Credits Description
  descriptions.push(
    `Total earnings: **${creditsEarned} credits**. Keep up the hustle!`
  );

  await economy.give(guild, user, creditsEarned); // Give the user the earned credits

  // User Balance
  const userBalance = await economy.balance(guild, user);

  const embedSuccess = new EmbedBuilder()
    .setColor("#895aed")
    .setAuthor({
      name: `${user.username}'s Work Result`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp()
    .setDescription(descriptions.join("\n"))
    .setFooter({
      text: `${user.username} just worked as a ${work.name}! ${
        work?.emoji || fallbackEmoji
      }`,
    })
    .addFields({
      name: "New Balance",
      value: `${userBalance.balance} credits`,
    });

  await interaction.editReply({ embeds: [embedSuccess] }); // Send the result as an embed message
};
