"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { apiClient } from "@/lib/api.client";
import Tweet from "@/components/shared/Tweet";
import {Tweet as TweetType} from "@/lib/types";
import { TweetInterface } from "@/lib/interfaces/tweets.interface";
import { mapTweetsToTweetInterfaces } from "@/lib/utils";
import {toast} from "sonner";

interface Props {
    initialTweets: TweetInterface[];
    currentUsername?: string;
}

export default function InfiniteTweetList({ initialTweets, currentUsername }: Props) {
    const [tweets, setTweets] = useState<TweetInterface[]>(initialTweets);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadMoreTweets = async () => {
        const endpoint = `/tweets?page=${page}&limit=10`;

        try {
            const response = await apiClient<ApiResponse<TweetType[]>>(endpoint);
            const newRawTweets = response.data || [];

            if (newRawTweets.length === 0) {
                setHasMore(false);
            } else {
                const newMappedTweets: TweetInterface[] = mapTweetsToTweetInterfaces(newRawTweets);

                setTweets((prev) => [...prev, ...newMappedTweets]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            toast.error("Failed to load more tweets" + error);
        }
    };

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreTweets();
        }
    }, [inView, hasMore, loadMoreTweets]);


    return (
        <div className="flex flex-col pb-10">
            {tweets.map((tweet, index) => (
                <Tweet key={`${tweet.id}-${index}`} {...tweet} currentUsername={currentUsername}/>
            ))}

            {hasMore && (
                <div ref={ref} className="flex justify-center p-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    );
}
