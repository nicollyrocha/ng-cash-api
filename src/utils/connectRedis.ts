import { createClient } from 'redis';

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

const connectRedis = async () => {
  console.log("connectRedis")
  try {
    console.log("entrou")
    await redisClient.connect();
    await redisClient.ping();
    console.log('Redis client connected successfully');
    //redisClient.set('try', 'Hello Welcome to Express with TypeORM');
  } catch (error) {
    console.log("errorrrr:",error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;

