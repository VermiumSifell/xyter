// Dependencies
import axios from "axios";
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "../../../logger";

// Function
export default async (interaction: CommandInteraction) => {
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
          description: `${res?.data?.message}: ${res?.data?.query}` as string,
          color: errorColor,
          timestamp: new Date(),
          footer: {
            iconURL: footerIcon as string,
            text: footerText as string,
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
              value: `${res?.data?.as || "Not available"}` as string,
            },
            {
              name: "Country",
              value: `${res?.data?.country || "Not available"}` as string,
            },
            {
              name: "Country Code",
              value: `${res?.data?.countryCode || "Not available"}` as string,
            },
            {
              name: "Region",
              value: `${res?.data?.region || "Not available"}` as string,
            },
            {
              name: "Region Name",
              value: `${res?.data?.regionName || "Not available"}` as string,
            },
            {
              name: "City",
              value: `${res?.data?.city || "Not available"}` as string,
            },
            {
              name: "ZIP Code",
              value: `${res?.data?.zip || "Not available"}` as string,
            },
            {
              name: "Latitude",
              value: `${res?.data?.lat || "Not available"}` as string,
            },
            {
              name: "Longitude",
              value: `${res?.data?.lon || "Not available"}` as string,
            },
            {
              name: "Timezone",
              value: `${res?.data?.timezone || "Not available"}` as string,
            },
            {
              name: "ISP",
              value: `${res?.data?.isp || "Not available"}` as string,
            },
            {
              name: "Organization",
              value: `${res?.data?.org || "Not available"}` as string,
            },
          ],
          color: successColor,
          timestamp: new Date(),
          footer: {
            iconURL: footerIcon as string,
            text: footerText as string,
          },
        };

        // Send interaction reply
        await interaction?.editReply({ embeds: [embed] });
      }
    })
    .catch(async (e) => {
      logger?.error(e);
    });
};
