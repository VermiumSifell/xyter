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
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("pterodactyl")
      .setDescription("Buy pterodactyl power.")
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("How much credits you want to withdraw.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, guild, user, client } = interaction;

    // Get options
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      logger?.verbose(`Amount is null.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":dollar: Credits [Gift]",
            description: "We could not read your requested amount.",
            color: errorColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    }

    if (guild === null) {
      return logger?.verbose(`Guild is null`);
    }

    // Get user object
    const userDB = await fetchUser(user, guild);

    if (userDB === null) {
      return logger?.verbose(`User is null`);
    }

    // Get DM user object
    const dmUser = client?.users?.cache?.get(user?.id);

    // Stop if amount or user credits is below 100
    if ((optionAmount || userDB?.credits) < 100) {
      logger?.verbose(`Amount or user credits is below 100.`);

      return interaction?.editReply({
        embeds: [
          {
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
          },
        ],
      });
    }

    // Stop if amount or user credits is above 1.000.000
    if ((optionAmount || userDB?.credits) > 1000000) {
      logger?.verbose(`Amount or user credits is above 1.000.000.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":shopping_cart: Shop [Pterodactyl]",
            description:
              "You **can't** withdraw for __Pterodactyl__ above **1.000.000**.",
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
          },
        ],
      });
    }

    // Stop if user credits is below amount
    if (userDB?.credits < optionAmount) {
      logger?.verbose(`User credits is below amount.`);

      return interaction?.editReply({
        embeds: [
          {
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
          },
        ],
      });
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
        logger?.verbose(`Successfully created voucher.`);

        // Withdraw amount from user credits
        userDB.credits -= optionAmount || userDB?.credits;

        // Save new credits
        await userDB
          ?.save()
          // If successful
          ?.then(async () => {
            logger?.verbose(`Successfully saved new credits.`);

            await dmUser?.send({
              embeds: [
                {
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
                },
              ],
            });

            return interaction?.editReply({
              embeds: [
                {
                  title: ":shopping_cart: Shop [Pterodactyl]",
                  description: "I have sent you the code in DM!",
                  color: successColor,
                  timestamp: new Date(),
                  footer: {
                    iconURL: footerIcon,
                    text: footerText,
                  },
                },
              ],
            });
          })

          // If error occurs
          .catch(async (error) => {
            logger?.verbose(`Error saving new credits. - ${error}`);

            return interaction?.editReply({
              embeds: [
                {
                  title: ":shopping_cart: Shop [Pterodactyl]",
                  description: "Something went wrong.",
                  color: errorColor,
                  timestamp: new Date(),
                  footer: {
                    iconURL: footerIcon,
                    text: footerText,
                  },
                },
              ],
            });
          });
      })

      // If error occurs
      .catch(async (error: any) => {
        logger?.verbose(`Error creating voucher. - ${error}`);

        return interaction?.editReply({
          embeds: [
            {
              title: ":shopping_cart: Shop [Pterodactyl]",
              description: "Something went wrong.",
              color: errorColor,
              timestamp: new Date(),
              footer: {
                iconURL: footerIcon,
                text: footerText,
              },
            },
          ],
        });
      });
  },
};
