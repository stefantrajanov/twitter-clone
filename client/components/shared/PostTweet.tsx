"use client"

import {Button} from "@/components/ui/button";
import {apiClient} from "@/lib/api.client";
import React, {useRef, useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {ImageIcon, X} from "lucide-react";

interface PostTweetProps {
    parentTweetId?: number;
}


export default function PostTweet({parentTweetId}: PostTweetProps) {
    const [content, setContent] = useState("");
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTweet = async () => {
        if (content.trim().length === 0 && (image === null || image === "")) {
            toast.error("Tweet content cannot be empty.");
            return;
        }
        try {
            const response = await apiClient<ApiResponse<never>>(`/tweets`, {
                method: "POST",
                body: JSON.stringify({
                    content: content,
                    parentTweetId: parentTweetId || null,
                    image: image || null
                }),
            });

            if (response.success) {
                toast.success("Success, your tweet is live!");
                setContent("");
                setImage(null);
                router.refresh();
            } else {
                toast.error("Failed to post tweet: " + response.message);
            }
        }catch (error) {
            toast.error("An error occurred while posting the tweet: " + error);
        }

    }
    return (
        <div className="flex flex-col w-full gap-3">
            <textarea
                className="bg-transparent text-xl placeholder:text-muted-foreground outline-none text-foreground"
                placeholder="What is happening?!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {image && (
                <div className="relative w-fit">
                    <img src={image} alt="Preview" className="max-h-60 rounded-xl border border-border"/>
                    <button
                        onClick={() => {
                            setImage(null);
                            if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                    >
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            )}
            <div className="flex justify-between items-end pt-3">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageSelect}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="w-5 h-5"/>
                </Button>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleTweet}
                    className="rounded-full px-6">Post</Button>
            </div>
        </div>
    )
}