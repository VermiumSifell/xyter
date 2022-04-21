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
        de: {
          general: { not_available: "Nicht verfügbar" },
          commands: {
            credits: {
              general: {
                credits_one: "{{count}} Guthaben",
                credits_other: "{{count}} Guthaben",
              },
              addons: {
                balance: { embed: { title: "Guthaben" } },
                gift: { embed: { title: "Geschenk" } },
              },
            },
            reputation: {
              addons: {
                give: {
                  version01: {
                    embed: {
                      title: ":medal: Ruf",
                      description:
                        "Du hast dir am letzten Tag einen Ruf verschafft, den du jetzt nicht rühmen kannst!",
                    },
                  },
                  version02: {
                    embed: {
                      title: ":medal: Ruf",
                      description:
                        "Du hast {{user}} einen {{type}} Ruf gegeben!",
                    },
                  },
                  version03: {
                    embed: {
                      title: ":medal: Ruf",
                      description: "Du kannst dich nicht selbst rühmen.",
                    },
                  },
                },
              },
            },
            profile: {
              addons: {
                view: {
                  embed: {
                    title: "Profil",
                    reputation: "Ruf (Weltweit)",
                    level: "Level (Gilde)",
                    points: "Punkte (Gilde)",
                    credits: "Guthaben (Gilde)",
                    language_code: "Sprachcode (Weltweit)",
                  },
                },
                settings: {
                  embed: {
                    title: "Profile",
                    description: "Folgende Einstellungen werden vorgenommen",
                    fields: { language: "Sprache" },
                  },
                },
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
