const tmi = require('tmi.js');

var username = '';
var msg = '';

const twitchMessages = (channel, duration = 300000, messageCallback = () => null) => {
  if (!channel) {
    console.error('Error: Canal no identificado');
    process.exit(1);
  }

  const twitch = new tmi.Client({
    options: { debug: true },
    channels: [ channel ],
  });

  twitch.connect();
  twitch.on('message', messageCallback);
  
  twitch.on("chat", (channel, user, message, self) => {
      username = user.username;
      msg = message;
  });
  
  if (duration) {
    setTimeout(() => twitch.disconnect(), duration);
  }
};

function usernameData() {
  var data = username;
  return username;
}

function messageData() {
  var data = msg;
  return msg;
}

module.exports = twitchMessages;
module.exports.usernameData = usernameData;
module.exports.messageData = messageData;
