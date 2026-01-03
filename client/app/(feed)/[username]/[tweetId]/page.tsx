import {Metadata} from "next";
import {TweetInterface} from "@/lib/interfaces/tweets.interface";
import SingleTweet from "@/app/(feed)/[username]/[tweetId]/_components/SingleTweet";
import Tweet from "@/components/shared/Tweet";
import {Tweet as TweetType} from "@/lib/types";
import {apiClient} from "@/lib/api.client";
import {notFound} from "next/navigation";
import BackButton from "@/components/shared/BackButton";
import {fetchUserData} from "@/app/(feed)/utils";
import {tweetToTweetInterface, mapTweetsToTweetInterfaces} from "@/lib/utils";
import {headers} from "next/headers";

interface PageProps {
    params: Promise<{ tweetId: number }>;
}

export async function fetchTweet(tweetId: number): Promise<TweetInterface> {
    try {
        const response = await apiClient<ApiResponse<TweetType>>(`/tweets/find/${tweetId}`, {
            method: "GET",
            headers: await headers(),
        });
        return tweetToTweetInterface(response.data);
    } catch (error) {
        console.error("Failed to fetch tweet:", error);
        throw error;
    }
}

export async function fetchComments(tweetId: number): Promise<TweetInterface[]> {
    try {
        const response = await apiClient<ApiResponse<TweetType[]>>(`/tweets/comments/${tweetId}`, {
            method: "GET",
            headers: await headers(),
        });
        return mapTweetsToTweetInterfaces(response.data);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw error;
    }
}


export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {tweetId} = await params;

    try {
        const tweet: TweetInterface = await fetchTweet(tweetId);
        return {
            title: `${tweet.displayName} on TwitterClone: "${tweet.content.slice(0, 50)}"`,
            description: `${tweet.displayName} (@${tweet.username}) tweeted: "${tweet.content}"`,
        };
    } catch (e) {
        return {
            title: "Tweet not found",
            description: "The requested tweet does not exist.",
        };
    }
}

export default async function TweetView({params}: PageProps) {
    const {tweetId} = await params;
    let tweet: TweetInterface;
    let comments: TweetInterface[] = [];
    let userImage: string | undefined;
    try {
        userImage = (await fetchUserData())?.image || undefined;
        tweet = await fetchTweet(tweetId);
        comments = await fetchComments(tweetId);
    } catch (error) {
        console.error("Failed to fetch tweet:", error);
        return notFound();
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <BackButton/>
                    <h1 className="font-bold">Tweet</h1>
                </div>
            </div>

            <SingleTweet {...tweet} userImage={userImage}/>
            <div>
                {comments.map((comment, index) => (
                    <Tweet key={`${comment.id}-${index}`} {...comment} parentTweetId={undefined} />
                ))}
            </div>
        </>
    );
}
