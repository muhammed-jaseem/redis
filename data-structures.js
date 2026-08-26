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

    // Strings GET, SET, MGET, MSET

    await client.set("user:name", "Jaseem");
    const name = await client.get("user:name");
    console.log(name);

    await client.mSet([
      "user:email",
      "jaseem@gamil.com",
      "user:age",
      "23",
      "user:country",
      "india",
    ]);
    const [email, age, country] = await client.mGet([
      "user:email",
      "user:age",
      "user:country",
    ]);
    console.log(email, age, country);

    // lists -> LPUSH, RPUSH, LRANGE, LPOP, RPOP
    await client.lPush("notes", ["notes-1", "notes-2", "notes-3"]);
    const extractAllNotes = await client.lRange("notes", 0, -1);
    console.log(extractAllNotes);

    const firstNote = await client.lPop("notes");
    console.log(firstNote);

    const remainingNotes = await client.lRange("notes", 0, -1);
    console.log(remainingNotes);

    // // sets -> SADD, SMEMBERS, SISMEMBER, SREM
    await client.sAdd("user:nickName", ["john", "varun", "xyz"]);
    const extractedUserNickNames = await client.sMembers("user:nickName");

    console.log(extractedUserNickNames);

    const isVarunOneOfUserNickName = await client.sIsMember(
      "user:nickName",
      "varun",
    );
    console.log(isVarunOneOfUserNickName);

    await client.sRem("user:nickName", "xyz");
    const updatedUserNickNames = await client.sMembers("user:nickName");
      console.log(updatedUserNickNames);

    // sorted sets
    // ZADD, ZRANGE, ZRANK,ZREM

    await client.zAdd("cart", [
      { score: 100, value: "Cart 1" },
      { score: 150, value: "Cart 2" },
      { score: 10, value: "Cart 3" },
    ]);

    const getCartItem = await client.zRange("cart", 0, -1);

    console.log(getCartItem);

    const extractedCartItemsWithScore = await client.zRangeWithScores(
      "cart",
      0,
      -1,
    );
    console.log(extractedCartItemsWithScore);

    const cartTwoWithRank = await client.zRank("cart", "Cart 2");
    console.log(cartTwoWithRank);

    // Hashes -> HGET,HSET, HGETALL, HDEL
    await client.hSet("product:1", {
      name: "product 1",
      description: "product one description",
      rating: "5",
    });

    const getProductRating = await client.hGet("product:1", "rating");
    console.log(getProductRating);

    const getProductDetails = await client.hGetAll("product:1");
    console.log(getProductDetails);

    await client.hDel("product:1", "rating");

    const updatedProductDetails = await client.hGetAll("product:1");
    console.log(updatedProductDetails);
  } catch (error) {
    console.log(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
