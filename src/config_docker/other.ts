// Development features

let isDevMode: boolean;

if (process.env["NODE_ENV"] == "production") {
  isDevMode = false;
} else {
  isDevMode = true;
}

export const devMode = isDevMode;

// Development guild
export const guildId = process.env["DISCORD_DEV_GUILD_ID"];

// Hoster name
export const hosterName = process.env["HOSTER_NAME"];

// Hoster Url
export const hosterUrl =
  process.env["HOSTER_URL"] ||
  "https://xyter.zyner.org/customization/change-hoster";

// Winston log level
export const logLevel = "info";
