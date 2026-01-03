import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateTweetDto} from './dto/create-tweet.dto';
import {UpdateTweetDto} from './dto/update-tweet.dto';
import {DATABASE_CONNECTION} from '../database/database.connection';
import {NodePgDatabase} from 'drizzle-orm/node-postgres';
import {eq, desc, isNull, and} from 'drizzle-orm';
import * as schema from '../database/schema';
import {Tweet} from "../database/schema";

@Injectable()
export class TweetsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>
    ) {
    }

    async create(createTweetDto: CreateTweetDto, userId: string): Promise<Tweet> {
        const [newTweet] = await this.db
            .insert(schema.tweets)
            .values({
                authorId: userId,
                ...createTweetDto
            })
            .returning();

        return newTweet;
    }

    async findAll(page: number = 1, limit: number = 10): Promise<Tweet[]> {
        return this.db.query.tweets.findMany({
            where: eq(schema.tweets.parentTweetId, isNull(schema.tweets.parentTweetId)),
            limit: limit,
            offset: (page - 1) * limit,
            orderBy: [desc(schema.tweets.createdAt)],
            with: {
                author: { with: { profile: true } },
                likes: { columns: { userId: true } },
                retweets: { columns: { userId: true } },
                replies: { columns: { id: true} },
            }
        });
    }

    async findAllByUser(userId: string): Promise<Tweet[]> {
        const [myTweets, myRetweets] = await Promise.all([
            this.db.query.tweets.findMany({
                where: eq(schema.tweets.authorId, userId),
                with: {
                    author: { with: { profile: true } },
                    likes: { columns: { userId: true } },
                    retweets: { columns: { userId: true } },
                    replies: { columns: { id: true} },
                }
            }),
            this.db.query.retweets.findMany({
                where: eq(schema.retweets.userId, userId),
                with: {
                    tweet: {
                        with: {
                            author: { with: { profile: true } },
                            likes: { columns: { userId: true } },
                            retweets: { columns: { userId: true } },
                            replies: { columns: { id: true} },
                        }
                    }
                }
            })
        ]);

        const combined = [
            ...myTweets.map(t => ({
                ...t,
                sortDate: new Date(t.createdAt).getTime(),
                isRetweet: false,
            })),
            ...myRetweets.map(r => ({
                ...r.tweet,
                sortDate: new Date(r.createdAt).getTime(),
                isRetweet: true,
            }))
        ];

        combined.sort((a, b) => b.sortDate - a.sortDate);

        return combined;
    }


    async findOne(id: number): Promise<Tweet> {
        const tweet = await this.db.query.tweets.findFirst({
            where: eq(schema.tweets.id, id),
            with: {
                author: { with: { profile: true } },
                likes: { columns: { userId: true } },
                retweets: { columns: { userId: true } },
                replies: { columns: { id: true} },
            }
        });

        if (!tweet) throw new NotFoundException(`Tweet #${id} not found`);
        return tweet;
    }

    async update(id: number, updateTweetDto: UpdateTweetDto): Promise<Tweet> {
        const [updated] = await this.db
            .update(schema.tweets)
            .set(updateTweetDto)
            .where(eq(schema.tweets.id, id))
            .returning();

        if (!updated) throw new NotFoundException(`Tweet #${id} not found`);
        return updated;
    }

    async remove(id: number, userId: string): Promise<Tweet[]> {
        return this.db
            .delete(schema.tweets)
            .where(and(
                    eq(schema.tweets.id, id),
                    eq(schema.tweets.authorId, userId)))
            .returning();
    }

    findComments(tweetId: number) {
        return this.db.query.tweets.findMany({
            orderBy: [desc(schema.tweets.createdAt)],
            where: eq(schema.tweets.parentTweetId, tweetId),
            with: {
                author: { with: { profile: true } },
                likes: { columns: { userId: true } },
                retweets: { columns: { userId: true } },
                replies: { columns: { id: true} },
            }
        });
    }
}