class Publisher {
  constructor(subject, client) {
    this.subject = subject;
    this.client = client;
  }
  publish(data) {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          console.log("publish failed: " + err);
          return reject(err);
        }
        console.log("published message with guid: " + guid);
        resolve();
      });
    });
  }
}

module.exports = Publisher;
