import { token, intents } from "./config/discord";

import { Client } from "discord.js";

import * as managers from "./managers";

const main = async () => {
  const client = new Client({
    intents,
  });

  await managers.start(client);

  await client.login(token);
};

main();
