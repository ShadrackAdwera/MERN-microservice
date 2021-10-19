class Listener {
    constructor(subject, queueGroupName, client, ackWait) {
      this.subject = subject;
      this.queueGroupName = queueGroupName;
      this.client = client; //the stan variable
      this.ackWait = ackWait; //5*1000
    }
    subscriptionOptions() {
      return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }
    listen() {
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
  
      subscription.on("message", (msg) => {
        // console.log(`Message received: [ ${msg.getSequence()} ]`);
        // console.log(msg.getData());
        const parsedData = this.parseMessage(msg);
        this.onMessage(parsedData, msg);
        msg.ack();
      });
    }
  
    parseMessage(msg) {
      const data = msg.getData();
      return typeof data === 'string'? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    }
    onMessage(parsedData, msg) {
        //do something here - post to db etc
        console.log(parsedData);
        msg.ack();
    }
  }

  module.exports = Listener;