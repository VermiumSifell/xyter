// Dependencies
import { ColorResolvable } from "discord.js";

// Color for successfully actions
export const successColor: ColorResolvable = "#22bb33";

// Color for waiting actions
export const waitColor: ColorResolvable = "#f0ad4e";

// Color for error actions
export const errorColor: ColorResolvable = "#bb2124";

// Footer text
export const footerText =
  process.env["EMBED_FOOTER_TEXT"] || "https://github.com/ZynerOrg/xyter";

// Footer icon
export const footerIcon =
  process.env["EMBED_FOOTER_ICON"] || "https://github.com/ZynerOrg.png";
