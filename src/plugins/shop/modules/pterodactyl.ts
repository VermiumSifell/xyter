import { CommandInteraction } from "discord.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import logger from "@logger";
import encryption from "@handlers/encryption";

import pluralize from "@helpers/pluralize";

import apiSchema from "@schemas/api";
import fetchUser from "@helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default {
  meta: { guildOnly: true, ephemeral: true },

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

    const optionAmount = options?.getInteger("amount");

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

    const userDB = await fetchUser(user, guild);

    if (userDB === null) {
      return logger?.verbose(`User is null`);
    }

    const dmUser = client?.users?.cache?.get(user?.id);

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

    const code = uuidv4();

    const apiCredentials = await apiSchema?.findOne({
      guildId: guild?.id,
    });

    const api = axios?.create({
      baseURL: apiCredentials?.url,
      headers: {
        Authorization: `Bearer ${encryption.decrypt(apiCredentials?.token)}`,
      },
    });

    const shopUrl = apiCredentials?.url?.replace("/api", "/store");

    await api

      ?.post("vouchers", {
        uses: 1,
        code,
        credits: optionAmount || userDB?.credits,
        memo: `${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
      })

      ?.then(async () => {
        logger?.verbose(`Successfully created voucher.`);

        userDB.credits -= optionAmount || userDB?.credits;

        await userDB
          ?.save()

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
