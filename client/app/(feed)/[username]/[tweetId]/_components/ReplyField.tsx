"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import PostTweet from "@/components/shared/PostTweet";

interface ReplyFieldProps {
    avatarUrl?: string;
    parentTweetId: number
}

export default function ReplyField({avatarUrl, parentTweetId}: ReplyFieldProps) {
    return (
        <div className="flex items-top w-full gap-3">
            <Avatar className="w-10 h-10">
                <AvatarImage src={avatarUrl}/>
                <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <PostTweet
                parentTweetId={parentTweetId}
            />
        </div>
    )
}