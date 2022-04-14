// Dependencies
import axios from "axios";
import { CommandInteraction } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Handlers
import logger from "@logger";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("lookup")
      .setDescription(
        "Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)"
      )
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("The query you want to look up.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;
    // Get lookup query
    const query = options?.getString("query");

    // Make API request
    await axios
      // Make a get request
      ?.get(`http://ip-api.com/json/${query}`)

      // If successful
      ?.then(async (res) => {
        // If query failed
        if (res?.data?.status === "fail") {
          // Create embed object
          const embed = {
            title: ":hammer: Utilities - Lookup",
            description: `${res?.data?.message}: ${res?.data?.query}`,
            color: errorColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          };

          // Send interaction reply
          await interaction?.editReply({ embeds: [embed] });
        }

        // If query is successful
        else if (res?.data?.status === "success") {
          // Create embed object
          const embed = {
            title: ":hammer: Utilities - Lookup",
            fields: [
              {
                name: "AS",
                value: `${res?.data?.as || "Not available"}`,
              },
              {
                name: "Country",
                value: `${res?.data?.country || "Not available"}`,
              },
              {
                name: "Country Code",
                value: `${res?.data?.countryCode || "Not available"}`,
              },
              {
                name: "Region",
                value: `${res?.data?.region || "Not available"}`,
              },
              {
                name: "Region Name",
                value: `${res?.data?.regionName || "Not available"}`,
              },
              {
                name: "City",
                value: `${res?.data?.city || "Not available"}`,
              },
              {
                name: "ZIP Code",
                value: `${res?.data?.zip || "Not available"}`,
              },
              {
                name: "Latitude",
                value: `${res?.data?.lat || "Not available"}`,
              },
              {
                name: "Longitude",
                value: `${res?.data?.lon || "Not available"}`,
              },
              {
                name: "Timezone",
                value: `${res?.data?.timezone || "Not available"}`,
              },
              {
                name: "ISP",
                value: `${res?.data?.isp || "Not available"}`,
              },
              {
                name: "Organization",
                value: `${res?.data?.org || "Not available"}`,
              },
            ],
            color: successColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          };

          // Send interaction reply
          await interaction?.editReply({ embeds: [embed] });
        }
      })
      .catch(async (e) => {
        logger?.error(e);
      });
  },
};
