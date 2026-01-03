import {Tweet as TweetType} from "@/lib/types";
import {apiClient} from "@/lib/api.client";
import {TweetInterface} from "@/lib/interfaces/tweets.interface";
import {headers} from "next/headers";
import InfiniteTweetList from "@/components/shared/InfiniteTweetList";
import Tweet from "@/components/shared/Tweet";
import {mapTweetsToTweetInterfaces} from "@/lib/utils";
import {fetchUserData, UserData} from "@/app/(feed)/utils";

interface TweetListProps {
    userId?: string;
}

export default async function TweetList({userId}: TweetListProps) {
    let initialTweets: TweetInterface[] = [];
    let userData: UserData | null = null;
    try {
        const endpoint = userId ? `/tweets/${userId}` : "/tweets?page=1&limit=10";
        const response = await apiClient<ApiResponse<TweetType[]>>(endpoint, {
            headers: await headers(),
            cache: "no-store",
        });

        userData = await fetchUserData();
        initialTweets = mapTweetsToTweetInterfaces(response.data)
    } catch (error) {
        console.error("Failed to fetch tweets:", error);
    }

    const latestTweetId = initialTweets[0]?.id || 'empty';
    return (
        !userId ? (
            <InfiniteTweetList
                key={latestTweetId}
                initialTweets={initialTweets}
                currentUsername={userData?.username}
            />) : (
            <div className="flex flex-col pb-10">
                {initialTweets.map((tweet, index) => (
                    <Tweet key={`${tweet.id}-${index}`} {...tweet} currentUsername={userData?.username} />
                ))}
            </div>
        )
    );
}
