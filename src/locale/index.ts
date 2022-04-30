import i18next from "i18next";
import AsyncBackend from "i18next-async-backend";

import logger from "@logger";

const resources = {
  en: {
    errors: () => import("@root/lang/en/errors.json"),
    plugins: () => import("@root/lang/en/plugins.json"),
  },
};

export default async () => {
  await i18next.use(AsyncBackend).init({
    backend: { resources },
  });

  //i18next now can be used to translate your application
  logger.silly(i18next.store.data);
};
