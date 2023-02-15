import { startRedis, stopRedis } from "@databases/index";
import { redisClient } from "@loaders/database.loader";

describe("Database redis test :)", () => {
  beforeAll(async () => {
    await startRedis();
  });

  describe("set/get/del test :)", () => {
    const testKey = "test";
    const testValue = "test";

    test("Set test", async () => {
      const isSuccess = await redisClient.set(testKey, testValue);

      expect(isSuccess).toEqual(true);
    });

    test("Get test", async () => {
      const value = await redisClient.get<boolean>(testKey);

      expect(value).toEqual(testValue);
    });

    test("Del test", async () => {
      const count = await redisClient.del(testKey);

      expect(count).toEqual(1);
    });
  });

  describe("hset/hget/hdel test :)", () => {
    const testKey = "test";
    const testField = "test1";
    const testValue = "test";

    test("Hash set test", async () => {
      const count = await redisClient.hset(testKey, testField, testValue);

      expect(count).toEqual(1);
    });

    test("Hash get test", async () => {
      const value = await redisClient.hget<boolean>(testKey, testField);

      expect(value).toEqual(testValue);
    });

    test("Hash del test", async () => {
      const count = await redisClient.hdel(testKey, testField);

      expect(count).toEqual(1);
    });
  });

  afterAll(async () => {
    await stopRedis();
  });
});
