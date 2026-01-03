import { pgTable, text, timestamp, boolean, index, serial, integer, primaryKey, check, AnyPgColumn } from "drizzle-orm/pg-core";
import {InferSelectModel, relations, sql} from "drizzle-orm";

// =========================================
// 1. AUTHENTICATION (Better Auth)
// =========================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// =========================================
// 2. PROFILES & SOCIAL GRAPH
// =========================================

export const profiles = pgTable("profiles", {
    id: text("id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    displayName: text("display_name").notNull(),
    biography: text("biography").default(''),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    email: text("email").notNull().unique(),
});

export const follows = pgTable("follows", {
    followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => ({
    pk: primaryKey({ columns: [t.followerId, t.followingId] }),
    checkSelfFollow: check("check_self_follow", sql`${t.followerId} <> ${t.followingId}`),
}));

// =========================================
// 3. TWEETS & INTERACTIONS
// =========================================

export const tweets = pgTable("tweets", {
    id: serial("tweet_id").primaryKey(),
    authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // Self-referencing FK for replies
    parentTweetId: integer("parent_tweet_id").references((): AnyPgColumn => tweets.id, { onDelete: "set null" }),
    image: text("image"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const likes = pgTable("likes", {
    tweetId: integer("tweet_id").notNull().references(() => tweets.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (t) => ({
    pk: primaryKey({ columns: [t.tweetId, t.userId] }),
}));

export const retweets = pgTable("retweets", {
    tweetId: integer("tweet_id").notNull().references(() => tweets.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.tweetId, t.userId] }),
}));

// =========================================
// 4. RELATIONS
// =========================================

export const userRelations = relations(user, ({ one, many }) => ({
    profile: one(profiles, { fields: [user.id], references: [profiles.id] }),
    tweets: many(tweets),
    likes: many(likes),
    retweets: many(retweets),
    followers: many(follows, { relationName: "following" }),
    following: many(follows, { relationName: "follower" }),
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
    user: one(user, { fields: [profiles.id], references: [user.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(user, { fields: [follows.followerId], references: [user.id], relationName: "follower" }),
    following: one(user, { fields: [follows.followingId], references: [user.id], relationName: "following" }),
}));

export const tweetsRelations = relations(tweets, ({ one, many }) => ({
    author: one(user, { fields: [tweets.authorId], references: [user.id] }),
    parentTweet: one(tweets, { fields: [tweets.parentTweetId], references: [tweets.id], relationName: "replies" }),
    replies: many(tweets, { relationName: "replies" }),
    likes: many(likes),
    retweets: many(retweets),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    tweet: one(tweets, { fields: [likes.tweetId], references: [tweets.id] }),
    user: one(user, { fields: [likes.userId], references: [user.id] }),
}));

export const retweetsRelations = relations(retweets, ({ one }) => ({
    tweet: one(tweets, { fields: [retweets.tweetId], references: [tweets.id] }),
    user: one(user, { fields: [retweets.userId], references: [user.id] }),
}));

// =========================================
// 5. EXPORT TYPES
// =========================================

export type Profile = InferSelectModel<typeof profiles>;
export type Tweet = InferSelectModel<typeof tweets>;
