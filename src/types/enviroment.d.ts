// Copyright (c) 2022 Joshua Schmitt
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_DEV_GUILD_ID: string;
      EMBED_FOOTER_TEXT: string;
      EMBED_FOOTER_ICON: string;
      SECRET_KEY: string;
      DISCORD_DEV_GUILD_ID: string;
      HOSTER_NAME: string;
      HOSTER_URL: string;
      NODE_ENV: string;
    }
  }
}

export {};
