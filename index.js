const twitchMessages = require('./src/twitch');
const DetectSentiment = require('./src/comprehend');

var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({region: 'us-west-2'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var uploadParams = {Bucket: 'bucket_donde_almacenaras_csv', Key: '', Body: ''};

var dataCSV = [];
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'twitchChat.csv',
  header: ['username','message','negative']
});


const argv = require('yargs')
    .options({
        'channel': {
            alias: 'c',
            describe: 'Twitch channel',
            demandOption: true,
        },
        'duration': {
          alias: 'd',
          describe: 'Monitoring time (ms)',
          type: 'number',
          default: 0,
        },
    }).argv;

const detectSentiment = new DetectSentiment(data => {
  const { ResultList } = data;
  const negatives = ResultList.map(negative => negative.SentimentScore.Negative);
  console.log(negatives);
  negatives.forEach(function(entry) {
    dataCSV = [
      {
        username: twitchMessages.usernameData(),
        message: twitchMessages.messageData(),
        negative: negatives[0]
      }
    ];
    csvWriter.writeRecords(dataCSV);
  });
  
  var file = './twitchChat.csv';
  var fileStream = fs.createReadStream(file);
  fileStream.on('error', function(err) {
    console.log('Error en el archivo', err);
  });
  
  uploadParams.Body = fileStream;
  var path = require('path');
  uploadParams.Key = path.basename(file);
    
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Archivo almacenado exitosamente", data.Location);
    }
  });

});
twitchMessages(
  argv.channel,
  argv.duration,
  (_, __, message) => detectSentiment.addMessage(message),
);
