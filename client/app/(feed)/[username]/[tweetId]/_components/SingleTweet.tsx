"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Heart, MessageCircle, Repeat, Share} from "lucide-react";
import {TweetInterface} from "@/lib/interfaces/tweets.interface";
import ReplyField from "@/app/(feed)/[username]/[tweetId]/_components/ReplyField";
import {useEffect, useState, MouseEvent} from "react";
import {apiClient} from "@/lib/api.client";
import {toast} from "sonner";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function SingleTweet({id, username, displayName, content, avatarUrl, likes, comments, retweets, timeAgo, createdAt, isRetweet = false, userImage, image}: TweetInterface & {userImage?: string}) {
    const [likesCount, setLikesCount] = useState(likes);
    const [retweetCount, setRetweetCount] = useState(retweets);
    const [isLiked, setIsLiked] = useState(false);
    const [isRetweeted, setIsRetweeted] = useState(false);
    const _createdAt = new Date(createdAt); // Wierd date error workaround
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await apiClient<ApiResponse<boolean>>(`/likes/check?tweetId=${id}`);
                setIsLiked(response.data);
            } catch (error) {
                toast.error("Failed to check like status: " + error);
            }
        };

        const checkRetweetStatus = async () => {
            try {
                const response = await apiClient<ApiResponse<boolean>>(`/retweets/check?tweetId=${id}`);
                setIsRetweeted(response.data);
            } catch (error) {
                toast.error("Failed to check retweet status:" + error);
            }
        }

        checkLikeStatus();
        checkRetweetStatus();
    }, [id]);

    const handleLike = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const previousLiked: boolean = isLiked;
        const previousCount: number = likesCount;
        setIsLiked(!previousLiked);

        try {
            if (previousLiked) {
                setLikesCount(likesCount - 1);
                await apiClient(`/likes?tweetId=${id}`, {
                    method: "DELETE",
                });
            } else {
                setLikesCount(likesCount + 1);
                await apiClient(`/likes`, {
                    method: "POST",
                    body: JSON.stringify({ tweetId: id }),
                });
            }
        } catch (error) {
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
            toast.error("Failed to update like status");
        }
    };

    const handleRetweet = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const previousRetweet: boolean = isRetweeted;
        const previousCount: number = retweetCount;
        setIsRetweeted(!previousRetweet);

        try {
            if (previousRetweet) {
                setRetweetCount(retweetCount - 1);
                console.log(retweetCount);
                await apiClient(`/retweets?tweetId=${id}`, {
                    method: "DELETE",
                });
            } else {
                setRetweetCount(retweetCount + 1);
                console.log(retweetCount);

                await apiClient(`/retweets`, {
                    method: "POST",
                    body: JSON.stringify({ tweetId: id }),
                });
            }
        } catch (error) {
            setIsRetweeted(previousRetweet);
            setRetweetCount(previousCount);
            toast.error("Failed to update like status");
        }
    };

    return (
        <div className="flex flex-col gap-2 p-3 border-b border-border">
            <div className="flex items-center">
                <Link
                    href={`/${username}`}
                >
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={avatarUrl}/>
                        <AvatarFallback>{username[0]}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col ml-3">
                    <Link
                        href={`/${username}`}
                    >
                    <span className="font-bold hover:underline">{displayName}</span>
                    </Link>
                    <Link
                        href={`/${username}`}
                    >
                        <span className="text-muted-foreground text-sm">@{username}</span>
                    </Link>
                    {isRetweet &&
                        <span className="text-sm text-green-500/80 flex gap-1 items-center">Retweeted <Repeat
                            className="w-3 h-3"/></span>
                    }
                </div>
            </div>

            <div className="flex flex-col w-full">
                <p className="mt-1 text-foreground text-[15px] leading-normal">{content}</p>
                {image && (
                    <div className="mt-4">
                        <img
                            src={image}
                            alt="Tweet attachment"
                            className="rounded-2xl border border-border w-full h-auto object-cover max-h-[500px] cursor-pointer hover:brightness-95 transition"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(true);
                            }}
                        />

                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            slides={[{src: image}]}
                            plugins={[Zoom]}
                            render={{
                                buttonPrev: () => null,
                                buttonNext: () => null,
                            }}
                        />
                    </div>
                )}
                <span className="text-muted-foreground text-sm mt-3">{getMonthName(_createdAt.getMonth())} {_createdAt.getFullYear()}, {_createdAt.toLocaleTimeString()}</span>
                <div className="flex justify-between ml-2 mt-3 text-muted-foreground border-t border-b p-2">
                    <Button variant="ghost" size="icon" className="hover:text-blue-500 h-8 w-8 ">
                        <MessageCircle className="w-4 h-4"/>
                        <span className="text-xs">{comments}</span>
                    </Button>
                    <Button
                        onClick={handleRetweet}
                        style={{color: isRetweeted ? 'rgb(34 197 94)' : undefined}}
                        variant="ghost" size="icon" className="hover:text-green-500 h-8 w-8">
                        <Repeat className="w-4 h-4"/>
                        <span className="text-xs">{retweetCount}</span>
                    </Button>
                    <Button
                        onClick={handleLike}
                        variant="ghost" size="icon" className="hover:text-pink-500 h-8 w-8" style={{color: isLiked ? 'rgb(236 72 153)' : undefined}}>
                        <Heart className="w-4 h-4"/>
                        <span className="text-xs">{likesCount}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-blue-500 h-8 w-8">
                        <Share className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
            <div className="my-3">
                <ReplyField
                    parentTweetId={id}
                    avatarUrl={userImage}
                />
            </div>
        </div>
    );
}


function getMonthName(monthNumber: number): string {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber];
}