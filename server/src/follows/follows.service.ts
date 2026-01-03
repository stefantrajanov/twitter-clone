import {Inject, Injectable, BadRequestException} from '@nestjs/common';
import {CreateFollowDto} from './dto/create-follow.dto';
import {DATABASE_CONNECTION} from '../database/database.connection';
import {NodePgDatabase} from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import {and, eq} from 'drizzle-orm';

@Injectable()
export class FollowsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>
    ) {
    }

    async create(followerId: string, createFollowDto: CreateFollowDto) {
        const followingId = await this._findIdByUsername(createFollowDto.followingUsername);

        if (followerId === followingId) {
            throw new BadRequestException("You cannot follow yourself");
        }

        const [follow] = await this.db
            .insert(schema.follows)
            .values({
                followerId: followerId,
                followingId: followingId
            })
            .returning();

        return follow;
    }

    async remove(followerId: string, followingUsername: string) {
        const followingId = await this._findIdByUsername(followingUsername);

        return this.db
            .delete(schema.follows)
            .where(
                and(
                    eq(schema.follows.followerId, followerId),
                    eq(schema.follows.followingId, followingId)
                )
            )
            .returning();
    }

    async getFollowers(userId: string) {
        return this.db.query.follows.findMany({
            where: eq(schema.follows.followingId, userId),
            with: {follower: true}
        });
    }

    async getFollowing(userId: string) {
        return this.db.query.follows.findMany({
            where: eq(schema.follows.followerId, userId),
            with: {following: true}
        });
    }

    async isFollowing(id: any, username: string) {
        const followingId = await this._findIdByUsername(username);

        return !!(await this.db.query.follows.findFirst({
            where: and(
                eq(schema.follows.followerId, id),
                eq(schema.follows.followingId, followingId)
            )
        }));
    }

    async _findIdByUsername(username: string): Promise<string> {
        const data = await this.db.query.profiles.findFirst({
            columns: {id: true},
            where: eq(schema.profiles.username, username)
        });

        if (!data) {
            throw new BadRequestException("The user does not exist");
        }

        return data.id;
    }

    async getFollowersCountByUsername(username: string) {
        const id = await this._findIdByUsername(username);

        return this.db.$count(schema.follows, eq(schema.follows.followingId, id));
    }

    async getFollowingCountByUsername(username: string) {
        const id = await this._findIdByUsername(username);

        return this.db.$count(schema.follows, eq(schema.follows.followerId, id));

    }
}