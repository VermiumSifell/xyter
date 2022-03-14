let DBD = require('discord-dashboard');
const config = require('../../config.json');

const DarkDashboard = require('dbd-dark-dashboard');
const { guilds, apis } = require('../helpers/database/models');

module.exports = async (client) => {
  await DBD.useLicense(config.dashboard.licenseKey);

  DBD.Dashboard = DBD.UpdatedClass();

  const Dashboard = new DBD.Dashboard({
    port: config.dashboard.port,
    client: {
      id: config.bot.clientId,
      secret: config.bot.clientSecret,
    },
    acceptPrivacyPolicy: true,
    redirectUri: `${config.dashboard.url}/discord/callback`,
    domain: `${config.dashboard.url}`,
    bot: client,
    theme: DarkDashboard({
      information: {
        createdBy: 'Zyner',
        websiteTitle: 'Xyter',
        websiteName: 'Xyter',
        websiteUrl: 'https://zyner.org',
        dashboardUrl: `${config.dashboard.url}`,
        supporteMail: 'contact@zyner.org',
        supportServer: 'https://discord.gg/Ve9ug2zkbt',
        imageFavicon:
          'https://avatars.githubusercontent.com/u/83163073?s=200&v=4',
        iconURL: 'https://avatars.githubusercontent.com/u/83163073?s=200&v=4',
        pageBackGround: 'linear-gradient(#2CA8FF, #155b8d)',
        loggedIn: 'Successfully signed in.',
        mainColor: '#2CA8FF',
        subColor: '#ebdbdb',
      },
      index: {
        card: {
          category: 'Xyter Panel',
          title: `Welcome to the Xyter panel.`,
          image: 'https://i.imgur.com/axnP93g.png',
          footer: 'Zyner',
        },
        information: {
          category: 'Self-host',
          title: 'Open Source',
          description: `The source code is available at https://github.com/ZynerOrg/xyter`,
          footer: 'Zyner',
        },
        feeds: {
          category: 'Support',
          title: 'Information',
          description: `If you need help, contact me on discord: Vermium#9649.`,
          footer: 'Zyner',
        },
      },
      commands: [
        {
          category: 'Commands',
          subTitle: 'All helpful commands',
          aliasesDisabled: false,
          list: [],
        },
      ],
    }),
    settings: [
      {
        categoryId: 'credits',
        categoryName: 'Credits',
        categoryDescription: 'Setup your bot with credit settings!',
        categoryOptionsList: [
          {
            optionId: 'status',
            optionName: 'Status',
            optionDescription: 'Toggle credits',
            optionType: DBD.formTypes.switch(),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });
              return guildData.credits.status;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              guildData.credits.status = newData ? true : false;

              await guildData.save();
              return;
            },
          },
          {
            optionId: 'rate',
            optionName: 'Rate',
            optionDescription: 'Rate',
            optionType: DBD.formTypes.input('1'),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              return guildData.credits.rate;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              if (newData.match(/^[0-9]+$/) == null) {
                return { error: 'Needs to be a number.' };
              }

              guildData.credits.rate = newData;
              await guildData.save();

              return;
            },
          },
          {
            optionId: 'minimumLength',
            optionName: 'Minimum Length',
            optionDescription: 'Minimum length to earn credits',
            optionType: DBD.formTypes.input('5'),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              return guildData.credits.minimumLength;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              if (newData.match(/^[0-9]+$/) == null) {
                return { error: 'Needs to be a number.' };
              }

              guildData.credits.minimumLength = newData;
              await guildData.save();

              return;
            },
          },
          {
            optionId: 'timeout',
            optionName: 'Timeout',
            optionDescription: 'Timeout between earnings (milliseconds)',
            optionType: DBD.formTypes.input('5000'),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              return guildData.credits.timeout;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              if (newData.match(/^[0-9]+$/) == null) {
                return { error: 'Needs to be a number.' };
              }

              guildData.credits.timeout = newData;
              await guildData.save();

              return;
            },
          },
          {
            optionId: 'workRate',
            optionName: 'Work Rate',
            optionDescription: 'Work Rate',
            optionType: DBD.formTypes.input('15'),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              return guildData.credits.workRate;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              if (newData.match(/^[0-9]+$/) == null) {
                return { error: 'Needs to be a number.' };
              }

              guildData.credits.workRate = newData;
              await guildData.save();

              return;
            },
          },
          {
            optionId: 'workTimeout',
            optionName: 'Work Timeout',
            optionDescription: 'Work Timeout (milliseconds)',
            optionType: DBD.formTypes.input('900000'),
            getActualSet: async ({ guild, user }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              return guildData.credits.workTimeout;
            },
            setNew: async ({ guild, newData }) => {
              const guildData = await guilds.findOne({ guildId: guild.id });

              if (newData.match(/^[0-9]+$/) == null) {
                return { error: 'Needs to be a number.' };
              }

              guildData.credits.workTimeout = newData;
              await guildData.save();

              return;
            },
          },
        ],
      },
      {
        categoryId: 'pterodactyl',
        categoryName: 'Pterodactyl',
        categoryDescription: 'Setup your bot with pterodactyl settings!',
        categoryOptionsList: [
          {
            optionId: 'url',
            optionName: 'URL',
            optionDescription: 'Configure your controlpanel.gg URL',
            optionType: DBD.formTypes.input('https://bg.zyner.org/api/'),
            getActualSet: async ({ guild, user }) => {
              const api = await apis.findOne({ guildId: guild.id });
              return api ? api.url : null;
            },
            setNew: async ({ guild, newData }) => {
              const api = await apis.findOne({ guildId: guild.id });

              api.url = newData || url;

              await api.save();

              return;
            },
          },
          {
            optionId: 'token',
            optionName: 'Token',
            optionDescription: 'Configure your controlpanel.gg Token',
            optionType: DBD.formTypes.input('1'),
            getActualSet: async ({ guild, user }) => {
              const api = await apis.findOne({ guildId: guild.id });
              return api ? api.token : null;
            },
            setNew: async ({ guild, newData }) => {
              const api = await apis.findOne({ guildId: guild.id });

              api.token = newData || token;

              await api.save();

              return;
            },
          },
        ],
      },
    ],
  });
  Dashboard.init();
};
