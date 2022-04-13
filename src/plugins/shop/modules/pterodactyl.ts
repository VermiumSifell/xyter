// Dependencies
import { CommandInteraction } from "discord.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";
import encryption from "@handlers/encryption";

// Helpers
import pluralize from "@helpers/pluralize";

// Models
import apiSchema from "@schemas/api";
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  const { options, guild, user, client } = interaction;

  // Get options
  const optionAmount = options?.getInteger("amount");

  // If amount is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]",
      description: "We could not read your requested amount.",
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

  if (guild === null) return;

  // Get user object
  const userDB = await fetchUser(user, guild);

  if (userDB === null) return;

  // Get DM user object
  const dmUser = client?.users?.cache?.get(user?.id);

  // Stop if amount or user credits is below 100
  if ((optionAmount || userDB?.credits) < 100) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]",
      description: `You **can't** withdraw for __Pterodactyl__ below **100**.`,
      color: errorColor,
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
    return interaction?.editReply({ embeds: [embed] });
  }

  // Stop if amount or user credits is above 1.000.000
  if ((optionAmount || userDB?.credits) > 1000000) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]",
      description: `You **can't** withdraw for __Pterodactyl__ above **1.000.000**.`,
      color: errorColor,
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
    return interaction?.editReply({ embeds: [embed] });
  }

  // Stop if user credits is below amount
  if (userDB?.credits < optionAmount) {
    const embed = {
      title: ":shopping_cart: Shop [Pterodactyl]",
      description: `You have **insufficient** credits.`,
      color: errorColor,
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
        title: ":shopping_cart: Shop [Pterodactyl]",
        description: `Redeem this voucher [here](${shopUrl})!`,
        fields: [
          { name: "Code", value: `${code}`, inline: true },
          {
            name: "Credits",
            value: `${optionAmount || userDB?.credits}`,
            inline: true,
          },
        ],
        color: successColor,
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon,
          text: footerText,
        },
      };

      // Create interaction embed object
      const interactionEmbed = {
        title: ":shopping_cart: Shop [Pterodactyl]",
        description: "I have sent you the code in DM!",
        color: successColor,
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon,
          text: footerText,
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
            `User: ${user?.username} redeemed: ${pluralize(
              optionAmount,
              "credit"
            )}`
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
            title: ":shopping_cart: Shop [Pterodactyl]",
            description:
              "Something went wrong while saving your credits, please try again later.",
            color: errorColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          };
          return interaction?.editReply({ embeds: [embed] });
        });
    })

    // If error occurs
    .catch(async (e) => {
      logger?.error(e);
      const embed = {
        title: ":shopping_cart: Shop [Pterodactyl]",
        description: "Something went wrong, please try again later.",
        color: errorColor,
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon,
          text: footerText,
        },
      };
      return interaction?.editReply({ embeds: [embed] });
    });
};
