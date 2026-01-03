import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {Tweet as TweetType} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function timeAgo(dateString: Date) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}


export function getMonthName(monthNumber: number): string {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber];
}


export function tweetToTweetInterface(tweet: TweetType) {
    return {
        id: tweet.id,
        username: tweet.author.profile?.username || "user",
        displayName: tweet.author.profile?.displayName || tweet.author.name,
        avatarUrl: tweet.author.profile?.image || undefined,
        content: tweet.content,
        timeAgo: timeAgo(tweet.createdAt),
        createdAt: tweet.createdAt,
        likes: tweet.likes.length,
        comments: tweet.replies ? tweet.replies.length : 0,
        retweets: tweet.retweets.length,
        isRetweet: tweet.isRetweet,
        parentTweetId: tweet.parentTweetId,
        image: tweet.image || undefined,
    };
}

export function mapTweetsToTweetInterfaces(tweets: TweetType[]) {
    return tweets.map(tweetToTweetInterface);
}