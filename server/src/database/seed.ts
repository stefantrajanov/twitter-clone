// src/database/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const main = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = drizzle(pool, { schema });

    console.log("Seeding database...");

    // 1. CLEANUP
    console.log("Clearing old data...");
    await db.delete(schema.follows);
    await db.delete(schema.likes);
    await db.delete(schema.retweets);
    await db.delete(schema.tweets);
    await db.delete(schema.profiles);
    await db.delete(schema.session);
    await db.delete(schema.account);
    await db.delete(schema.user);

    // 2. CREATE USERS & PROFILES
    console.log("Creating users...");
    let users: string[] = [];

    for (let i = 0; i < 10; i++) {
        const userId = faker.string.uuid();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const imageUrl = faker.image.avatar();
        const createdAt = faker.date.past({ years: 1 });

        // Insert User
        await db.insert(schema.user).values({
            id: userId,
            name: `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            emailVerified: true,
            image: imageUrl,
            createdAt: createdAt,
            updatedAt: createdAt,
        });

        // Insert Profile
        await db.insert(schema.profiles).values({
            id: userId,
            username: faker.internet.username({ firstName, lastName }).toLowerCase(),
            displayName: `${firstName} ${lastName}`,
            biography: faker.person.bio(),
            image: imageUrl,
            email: email.toLowerCase(),
            createdAt: createdAt,
        });

        users.push(userId);
    }

    // 3. CREATE FOLLOWS
    console.log("Creating follows...");
    for (const followerId of users) {
        // Each user follows 3 random people
        const randomFollowing = faker.helpers.arrayElements(users, 3);
        for (const followingId of randomFollowing) {
            if (followerId !== followingId) {
                await db.insert(schema.follows).values({
                    followerId,
                    followingId,
                }).onConflictDoNothing(); // Prevent duplicates
            }
        }
    }

    // 4. CREATE TWEETS
    console.log("Creating tweets...");
    let allTweets: number[] = [];

    for (const userId of users) {
        // Each user creates 3-5 tweets
        const tweetCount = faker.number.int({ min: 3, max: 5 });

        for (let i = 0; i < tweetCount; i++) {
            const [newTweet] = await db.insert(schema.tweets).values({
                authorId: userId,
                content: faker.lorem.sentence({ min: 5, max: 15 }),
                createdAt: faker.date.recent({ days: 10 }),
                image: faker.datatype.boolean() ? faker.image.urlPicsumPhotos({ width: 400, height: 300 }) : null,
            }).returning();

            allTweets.push(newTweet.id);
        }

        // Each user also comments on 2 random tweets
        const commentedTweets = faker.helpers.arrayElements(allTweets, 2);
        for (const parentTweetId of commentedTweets) {
            const [commentTweet] = await db.insert(schema.tweets).values({
                authorId: userId,
                content: faker.lorem.sentence({ min: 5, max: 15 }),
                parentTweetId: parentTweetId,
                createdAt: faker.date.recent({ days: 10 }),
                image: faker.datatype.boolean() ? faker.image.urlPicsumPhotos({ width: 400, height: 300 }) : null,
            }).returning();

            allTweets.push(commentTweet.id);
        }
    }

    // 5. CREATE LIKES
    console.log("Creating likes...");
    for (const userId of users) {
        const likedTweets = faker.helpers.arrayElements(allTweets, 5);
        for (const tweetId of likedTweets) {
            await db.insert(schema.likes).values({
                userId,
                tweetId,
            }).onConflictDoNothing();
        }
    }


    // 6. CREATE RETWEETS
    console.log("Creating retweets...");
    for (const userId of users) {
        // Each user retweets 2-4 random tweets
        const retweetedTweets = faker.helpers.arrayElements(allTweets, faker.number.int({ min: 2, max: 4 }));

        for (const tweetId of retweetedTweets) {
            await db.insert(schema.retweets).values({
                userId,
                tweetId,
            }).onConflictDoNothing();
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
};

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});