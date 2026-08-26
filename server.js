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
  } catch (error) {
    console.log(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
