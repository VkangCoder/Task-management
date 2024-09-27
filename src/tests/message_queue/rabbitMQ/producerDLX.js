const amqp = require("amqplib");
const messages = "hello rabbitMQ for Vinh Phan";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const noticationExchange = "noticationEx"; //notificationEx     direct
    const notiQueue = "notificationQueueProcess"; //assert Queue
    const notificationExchangeDLX = "notificationExchangeDLX";
    const notifiationRoutingKeyDlx = "notifiationRoutingKeyDlx";
    //1.create Exchange
    await channel.assertExchange(noticationExchange, "direct", {
      durable: true,
    });
    //2. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các kết nối truy cập vào hàng đợi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notifiationRoutingKeyDlx,
    });

    //3. Bind queue
    await channel.bindQueue(queueResult.queue, noticationExchange);

    //4. Send messages
    const msg = "a new task";
    console.log("task msg::::", msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: 10000,
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
