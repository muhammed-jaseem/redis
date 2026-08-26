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

    await client.set("name", "Samuel");
    const extractedValue = await client.get("name");
    console.log(extractedValue);

    const deleteCount = await client.del("name");
    console.log(deleteCount);

    const updatedValue = await client.get("name");
    console.log(updatedValue);

    const countValue = await client.set("count", 52);
    const extractedCountValue = await client.get("count");
    console.log(extractedCountValue);

    const incrementedValue = await client.incr("count");
    console.log(incrementedValue);

    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");

    console.log(await client.get("count"));
  } catch (error) {
    console.log(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
