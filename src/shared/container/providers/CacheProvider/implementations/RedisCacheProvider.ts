import Redis, { Redis as RedisInterface } from 'ioredis';
import cache from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisInterface;

  constructor() {
    this.client = new Redis(cache.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
