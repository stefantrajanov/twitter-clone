import {Inject, Injectable, ConflictException} from '@nestjs/common';
import {CreateRetweetDto} from './dto/create-retweet.dto';
import {DATABASE_CONNECTION} from '../database/database.connection';
import {NodePgDatabase} from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import {and, eq} from 'drizzle-orm';

@Injectable()
export class RetweetsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>
    ) {
    }

    async create(tweetId: number, userId: string) {
        try {
            const [retweet] = await this.db
                .insert(schema.retweets)
                .values({
                    tweetId,
                    userId,
                })
                .returning();
            return retweet;
        } catch (error) {
            if (error.code === '23505') throw new ConflictException('Already retweeted');
            throw error;
        }
    }

    async remove(tweetId: number, userId: string) {
        return this.db
            .delete(schema.retweets)
            .where(
                and(
                    eq(schema.retweets.tweetId, tweetId),
                    eq(schema.retweets.userId, userId)
                )
            )
            .returning();
    }

    async checkRetweet(tweetId: number, userId: string) {
        const retweet = await this.db.query.retweets.findFirst({
            where: and(
                eq(schema.retweets.tweetId, tweetId),
                eq(schema.retweets.userId, userId)
            )
        });
        return !!retweet;
    }
}