const AWS = require('aws-sdk');

class DetectSentiment {
  constructor(callback) {
    this.callback = callback;    
    this.messages = [];
    this.comprehend = new AWS.Comprehend();
  }

  addMessage(message) {
    this.messages.push(message.substr(0, 5000));
    if (this.messages.length === 1) {
      this.comprehend.batchDetectSentiment({
        LanguageCode: 'es',
        TextList: this.messages,
      }, (error, data) => {
        if (error) {
          console.error(error);
          process.exit(1);
        } else if (!data) {
          console.error('Error: No hay respuesta de Comprehend');
          process.exit(1);
        }
        this.callback(data);
      });
      this.messages = [];
    }
  }
}

module.exports = DetectSentiment;
