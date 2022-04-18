import i18next from "i18next";
import logger from "@logger";

export default async () => {
  await i18next
    .init({
      // lng: "en", // if you're using a language detector, do not define the lng option
      // debug: true,
      fallbackLng: "en",
      resources: {
        en: {
          plugins: {
            credits: {
              modules: {
                balance: { general: { title: "[:dollar:] Credits (Balance)" } },
              },
            },
          },
        },
        sv: {
          plugins: {
            credits: {
              modules: {
                balance: { general: { title: "[:dollar:] Krediter (Balans)" } },
              },
            },
          },
        },
      },
    })
    .then(async () => {
      logger.debug(`i18next initialized`);
    })
    .catch(async (error) => {
      logger.error(`i18next failed to initialize: ${error}`);
    });
};
