const fs = require('fs'); // fs

module.exports = async (client) => {
  const eventFiles = fs
    .readdirSync('./src/events')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};
