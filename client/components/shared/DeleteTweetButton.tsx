"use client"

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {EllipsisVertical, Trash} from "lucide-react";
import {apiClient} from "@/lib/api.client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface DeleteTweetButtonProps {
    tweetId: number;
}

export default function DeleteTweetButton({tweetId}: DeleteTweetButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await apiClient<ApiResponse<never>>(`/tweets/${tweetId}`, {
                method: "DELETE",
            });

            if (response.success) {
                toast.success(`Tweet deleted successfully`);
                router.refresh();
            } else {
                toast.error(`Failed to delete tweet, ${response.message}`);
            }
        } catch (e) {
            toast.error("An error occurred: " + (e as Error).message);
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-auto p-2 rounded-full">
                    <EllipsisVertical className="w-5 h-5"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete}>
                          <Trash/> Delete Tweet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}