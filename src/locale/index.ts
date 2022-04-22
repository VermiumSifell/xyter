import otaClient, { LanguageStrings } from "@crowdin/ota-client";
import i18next from "i18next";

const client = new otaClient("ffd2068395f215046cc01f8lfji");

export interface translation {
  [key: string]: string;
}

export default async () => {
  //load needed information from Crowdin distribution
  const languages = await client.listLanguages();
  const translations = await client.getStrings();
  const resources = {} as LanguageStrings;

  // eslint-disable-next-line no-loops/no-loops
  for (const lngCode in translations) {
    resources[lngCode] = translations[lngCode];
  }
  //initialize i18next
  await i18next.init({
    lng: languages[0],
    supportedLngs: languages,
    resources,
  });
  //i18next now can be used to translate your application
  console.log(i18next.store.data);
};
