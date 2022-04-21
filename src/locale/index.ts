import i18next from "i18next";
import logger from "@logger";

export default async () => {
  await i18next
    .init({
      lng: "en", // if you're using a language detector, do not define the lng option
      // debug: true,
      fallbackLng: "en",
      resources: {
        en: {
          general: { not_available: "Not Available" },
          commands: {
            credits: {
              general: {
                credits_one: "{{count}} credit",
                credits_other: "{{count}} credits",
              },
              addons: {
                balance: { embed: { title: "Credits" } },
                gift: { embed: { title: "Gift" } },
              },
            },
            reputation: {
              addons: {
                give: {
                  version01: {
                    embed: {
                      title: ":medal: Reputation",
                      description:
                        "You have given reputation within the last day, you can not repute now!",
                    },
                  },
                  version02: {
                    embed: {
                      title: ":medal: Reputation",
                      description:
                        "You have given {{user}} a {{type}} reputation!",
                    },
                  },
                  version03: {
                    embed: {
                      title: ":medal: Reputation",
                      description: "You can not repute yourself.",
                    },
                  },
                },
              },
            },
            profile: {
              addons: {
                view: {
                  embed: {
                    title: "Profile",
                    reputation: "Reputation (Global)",
                    level: "Level (Guild)",
                    points: "Points (Guild)",
                    credits: "Credits (Guild)",
                    language_code: "Language Code (Global)",
                  },
                },
                settings: {
                  embed: {
                    title: "Profile",
                    description: "Following settings is set",
                    fields: { language: "Language" },
                  },
                },
              },
            },
          },
        },
        sv: {
          general: { not_available: "Otillgänglig" },
          commands: {
            credits: {
              general: {
                credits_one: "{{count}} krona",
                credits_other: "{{count}} kronor",
              },
              addons: {
                balance: { embed: { title: "Krediter" } },
                gift: { embed: { title: "Gåva" } },
              },
            },
            reputation: {
              addons: {
                give: {
                  version01: {
                    embed: {
                      title: ":medal: Omdöme",
                      description:
                        "Du har redan gett omdöme inom den senaste dagen, du kan inte ge ett omdöme just nu!",
                    },
                  },
                  version02: {
                    embed: {
                      title: ":medal: Omdöme",
                      description: "Du har gett {{user}} ett {{type}} omdöme!",
                    },
                  },
                  version03: {
                    embed: {
                      title: ":medal: Omdöme",
                      description: "Du kan inte ge dig själv ett omdöme.",
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
                    reputation: "Omdöme (Globalt)",
                    level: "Nivå (Server)",
                    points: "Poäng (Server)",
                    credits: "Krediter (Server)",
                    language_code: "Språkkod (Globalt)",
                  },
                },
                settings: {
                  embed: {
                    title: "Profil",
                    description: "Följande inställningar är satta",
                    fields: { language: "Språk" },
                  },
                },
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
