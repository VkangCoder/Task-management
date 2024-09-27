"use strict";
const amqp = require("amqplib");
//
async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-message";

  await channel.assertQueue(queueName, { durable: true });
  //Set prefetch to 1 to ensure only 1 ack at a time
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();
    setTimeout(() => {
      console.log("processed", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });

  for (let index = 0; index < 10; index++) {
    const message = `ordered-queue-message:: ${index}`;

    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true, //afraid lost message when sever is die
    });

    setTimeout(() => {
      connection.close;
    }, 1000);
  }
}
consumerOrderedMessage().catch((err) => console.log(err));
