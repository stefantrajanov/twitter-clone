"use client";

import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {apiClient} from "@/lib/api.client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function FollowButton({username}: { username: string }) {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const router = useRouter();

    useEffect (() => {
        const checkFollowStatus = async () => {
            try {
                const response = await apiClient<ApiResponse<boolean>>(`/follows/${username}`);
                setIsFollowing(response.data);
            } catch (error) {
                toast.error("Failed to check follow status: " + error);
            }
        };
        checkFollowStatus();
    }, [username]);

    const handleFollow = async () => {
        try {
            const endpoint= isFollowing ? `/follows?followingUsername=${username}` : `/follows`;
            const method = isFollowing ? "DELETE" : "POST";
            const message = isFollowing ? "unfollowed" : "followed";

            const response = await apiClient<ApiResponse<never>>(endpoint, {
                method: method,
                body: JSON.stringify({followingUsername: username}),
            });
            setIsFollowing(!isFollowing);

            if (response.success) {
                toast.success(`You have ${message} ${username}`);
                router.refresh();
            } else {
                toast.error(`Failed to ${message} ${username}, ${response.message}`);
            }
        } catch (e) {
            toast.error("An error occurred: " + (e as Error).message);
        }
    }
    return (
        <Button
            onClick={handleFollow}
            className="rounded-full">
            {(isFollowing) ? "Following" : "Follow"}
        </Button>
    );
}