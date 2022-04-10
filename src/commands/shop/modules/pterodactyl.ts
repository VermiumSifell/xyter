// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Configurations
import config from "../../../../config.json";

// Handlers
import logger from "../../../handlers/logger";
import encryption from "../../../handlers/encryption";

// Helpers
import creditNoun from "../../../helpers/creditNoun";

// Models
import apiSchema from "../../../helpers/database/models/apiSchema";
import fetchUser from "../../../helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  const { options, guild, user, client } = interaction;

  // Get options
  const optionAmount = options?.getInteger("amount");

  // If amount is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description: "We could not read your requested amount." as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  if (guild === null) return;

  // Get user object
  const userDB = await fetchUser(user, guild);

  if (userDB === null) return;

  // Get DM user object
  const dmUser = client?.users?.cache?.get(user?.id);

  // Stop if amount or user credits is below 100
  if ((optionAmount || userDB?.credits) < 100) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]" as string,
      description:
        `You **can't** withdraw for __Pterodactyl__ below **100**.` as string,
      color: config?.colors?.error as ColorResolvable,
      fields: [
        {
          name: "Your balance" as string,
          value: `${creditNoun(userDB?.credits)}` as string,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };
    return interaction?.editReply({ embeds: [embed] });
  }

  // Stop if amount or user credits is above 1.000.000
  if ((optionAmount || userDB?.credits) > 1000000) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]" as string,
      description:
        `You **can't** withdraw for __Pterodactyl__ above **1.000.000**.` as string,
      color: config?.colors?.error as ColorResolvable,
      fields: [
        {
          name: "Your balance" as string,
          value: `${creditNoun(userDB?.credits)}` as string,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };
    return interaction?.editReply({ embeds: [embed] });
  }

  // Stop if user credits is below amount
  if (userDB?.credits < optionAmount) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]" as string,
      description: `You have **insufficient** credits.` as string,
      color: config.colors.error as ColorResolvable,
      fields: [
        {
          name: "Your balance" as string,
          value: `${creditNoun(userDB?.credits)}` as string,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };
    return interaction?.editReply({ embeds: [embed] });
  }

  // Generate a unique voucher for the user
  const code = uuidv4();

  // Get api object
  const apiCredentials = await apiSchema?.findOne({
    guildId: guild?.id,
  });

  // Create a api instance
  const api = axios?.create({
    baseURL: apiCredentials?.url,
    headers: {
      Authorization: `Bearer ${encryption.decrypt(apiCredentials?.token)}`,
    },
  });

  // Get shop URL
  const shopUrl = apiCredentials?.url?.replace("/api", "/store");

  // Make API request
  await api

    // Make a post request to the API
    ?.post("vouchers", {
      uses: 1,
      code,
      credits: optionAmount || userDB?.credits,
      memo: `${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
    })

    // If successful
    ?.then(async () => {
      // Create DM embed object
      const dmEmbed = {
        title: ":shopping_cart: Shop [Pterodactyl]" as string,
        description: `Redeem this voucher [here](${shopUrl})!` as string,
        fields: [
          { name: "Code" as string, value: `${code}` as string, inline: true },
          {
            name: "Credits" as string,
            value: `${optionAmount || userDB?.credits}` as string,
            inline: true,
          },
        ],
        color: config?.colors?.success as ColorResolvable,
        timestamp: new Date(),
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Create interaction embed object
      const interactionEmbed = {
        title: ":shopping_cart: Shop [Pterodactyl]" as string,
        description: "I have sent you the code in DM!" as string,
        color: config?.colors?.success as ColorResolvable,
        timestamp: new Date(),
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Withdraw amount from user credits
      userDB.credits -= optionAmount || userDB?.credits;

      // Save new credits
      await userDB
        ?.save()
        // If successful
        ?.then(async () => {
          // Send debug message
          logger?.debug(
            `User: ${user?.username} redeemed: ${creditNoun(optionAmount)}`
          );

          // Send DM message
          await dmUser?.send({ embeds: [dmEmbed] });

          // Send interaction reply
          await interaction?.editReply({
            embeds: [interactionEmbed],
          });
        })

        // If error occurs
        .catch(async (e: any) => {
          logger?.error(e);
          const embed = {
            title: ":shopping_cart: Shop [Pterodactyl]" as string,
            description:
              "Something went wrong, please try again later." as string,
            color: config?.colors?.error as ColorResolvable,
            timestamp: new Date(),
            footer: {
              iconURL: config?.footer?.icon as string,
              text: config?.footer?.text as string,
            },
          };
          return interaction?.editReply({ embeds: [embed] });
        });
    })

    // If error occurs
    .catch(async (e) => {
      logger?.error(e);
      const embed = {
        title: ":shopping_cart: Shop [Pterodactyl]" as string,
        description: "Something went wrong, please try again later." as string,
        color: config?.colors?.error as ColorResolvable,
        timestamp: new Date(),
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };
      return interaction?.editReply({ embeds: [embed] });
    });
};
