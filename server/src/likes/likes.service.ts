import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { DATABASE_CONNECTION } from '../database/database.connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class LikesService {
  constructor(
      @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(tweetId: number, userId: string) {
    try {
      const [newLike] = await this.db
          .insert(schema.likes)
          .values({
            tweetId,
            userId
          })
          .returning();
      return newLike;
    } catch (error) {
      if (error.code === '23505') throw new ConflictException('User already liked this tweet');
      throw error;
    }
  }

  async remove(tweetId: number, userId: string) {
    return this.db
        .delete(schema.likes)
        .where(
            and(
                eq(schema.likes.tweetId, tweetId),
                eq(schema.likes.userId, userId)
            )
        )
        .returning();
  }

  async checkLike(tweetId: number, userId: string) {
    const like = await this.db.query.likes.findFirst({
      where: and(
          eq(schema.likes.tweetId, tweetId),
          eq(schema.likes.userId, userId)
      )
    });
    return !!like;
  }
}