// Dependencies
import axios from "axios";
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../config.json";

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
          title: ":hammer: Utilities - Lookup" as string,
          description: `${res?.data?.message}: ${res?.data?.query}` as string,
          color: config?.colors?.error as ColorResolvable,
          timestamp: new Date(),
          footer: {
            iconURL: config?.footer?.icon as string,
            text: config?.footer?.text as string,
          },
        };

        // Send interaction reply
        await interaction?.editReply({ embeds: [embed] });
      }

      // If query is successful
      else if (res?.data?.status === "success") {
        // Create embed object
        const embed = {
          title: ":hammer: Utilities - Lookup" as string,
          fields: [
            {
              name: "AS" as string,
              value: `${res?.data?.as || "Not available"}` as string,
            },
            {
              name: "Country" as string,
              value: `${res?.data?.country || "Not available"}` as string,
            },
            {
              name: "Country Code" as string,
              value: `${res?.data?.countryCode || "Not available"}` as string,
            },
            {
              name: "Region" as string,
              value: `${res?.data?.region || "Not available"}` as string,
            },
            {
              name: "Region Name" as string,
              value: `${res?.data?.regionName || "Not available"}` as string,
            },
            {
              name: "City" as string,
              value: `${res?.data?.city || "Not available"}` as string,
            },
            {
              name: "ZIP Code" as string,
              value: `${res?.data?.zip || "Not available"}` as string,
            },
            {
              name: "Latitude" as string,
              value: `${res?.data?.lat || "Not available"}` as string,
            },
            {
              name: "Longitude" as string,
              value: `${res?.data?.lon || "Not available"}` as string,
            },
            {
              name: "Timezone" as string,
              value: `${res?.data?.timezone || "Not available"}` as string,
            },
            {
              name: "ISP" as string,
              value: `${res?.data?.isp || "Not available"}` as string,
            },
            {
              name: "Organization" as string,
              value: `${res?.data?.org || "Not available"}` as string,
            },
          ],
          color: config?.colors?.success as ColorResolvable,
          timestamp: new Date(),
          footer: {
            iconURL: config?.footer?.icon as string,
            text: config?.footer?.text as string,
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
