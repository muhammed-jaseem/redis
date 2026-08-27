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

    const subscriber = await client.duplicate(); // creates a new client but shares the same connection
    await subscriber.connect();

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Recieved message from ${channel}: ${message}`);
    });

    // publish message to dummy channel
    await client.publish("dummy-channel", " Some dummy data from publisher");
    await client.publish("dummy-channel", "Another dummy data from publisher");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await subscriber.unsubscribe("dummy-channel");
    await subscriber.quit(); // close the subscriber connection
  } catch (error) {
    console.log(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
