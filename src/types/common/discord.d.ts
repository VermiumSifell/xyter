import { Collection, Client as DJSClient } from "discord.js";
declare module "discord.js" {
  export interface Client extends DJSClient {
    commands: Collection<unknown, any>;
  }
}

export { Client };
