const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("error", (error) => {
  console.log(error);
});

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Connected to redis");

    // const subscriber = await client.duplicate(); // creates a new client but shares the same connection
    // await subscriber.connect();

    // await subscriber.subscribe("dummy-channel", (message, channel) => {
    //   console.log(`Recieved message from ${channel}: ${message}`);
    // });

    // // publish message to dummy channel
    // await client.publish("dummy-channel", " Some dummy data from publisher");
    // await client.publish("dummy-channel", "Another dummy data from publisher");

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // await subscriber.unsubscribe("dummy-channel");
    // await subscriber.quit(); // close the subscriber connection

    // pipelining and transactions

    // const multi = client.multi();

    // multi.set("key-transaction-1", "value1");
    // multi.set("key-transaction-2", "value2");
    // multi.get("key-transaction-1");
    // multi.get("key-transaction-2");

    // const results = await multi.exec();
    // console.log(results);

    // const pipeline = client.multi();

    // multi.set("key-pipeline-1", "value1");
    // multi.set("key-pipeline-2", "value2");
    // multi.get("key-pipeline-1");
    // multi.get("key-pipeline-2");

    // const pipelineResults = await multi.exec();
    // console.log(pipelineResults);

    // // batch data operation
    // const pipelineOne = client.multi();

    // for (let i = 0; i < 1000; i++) {
    //   pipeline.set(`user:${i}:action`, `Action ${i}`);
    // }

    // await pipelineOne.exec();

    // const dummyExample = client.multi();
    // multi.decrBy("user:1234:balance", 100);
    // multi.incrBy("account:0000:balance", 100);
    // const finalResults = await multi.exec();

    // const cartExample = client.multi();
    // multi.incrBy("cart:1234:item-count", 1);
    // multi.decrBy("cart:1234:total-price", 10);
    // await multi.exec();

    console.time("Without pipelining");
    for (let i = 0; i < 1000; i++) {
      await client.set(`user${i}`, `user_value${i}`);
    }

    console.timeEnd("Without pipelining");

    console.time("With pipelining");
    const bigPipeline = client.multi();
    for (let i = 0; i < 1000; i++) {
      bigPipeline.set(`user_pipeline${i}`, `user_pipeline_value${i}`);
    }

    await bigPipeline.exec();
    console.timeEnd("With pipelining");
  } catch (error) {
    console.log(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
