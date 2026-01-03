export interface TweetInterface {
    id: number;
    username: string;
    displayName: string;
    content: string;
    avatarUrl?: string;
    likes: number;
    comments: number;
    retweets: number;
    timeAgo: string;
    createdAt: Date;
    isRetweet?: boolean;
    parentTweetId?: number;
    image?: string;
    currentUsername?: string;
}