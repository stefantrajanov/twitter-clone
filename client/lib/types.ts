export interface User {
    createdAt: Date
    email: string
    emailVerified: boolean
    id: string
    image?: string | null | undefined;
    name: string
    updatedAt: Date
    profile?: Profile | null
}

export interface Profile {
    id: string
    displayName: string
    biography: string | null
    username: string
    email: string
    image: string | null
    createdAt: Date
}

export interface Like {
    tweetId: number
    userId: string
}

export interface Retweet {
    tweetId: number
    userId: string
}

export interface Tweet {
    authorId: string
    content: string
    createdAt: Date
    deletedAt: Date | null
    id: number
    image: string | null
    parentTweetId: number | undefined
    likes: Like[],
    retweets: Retweet[],
    replies: Tweet[],
    author: User
    isRetweet?: boolean
}