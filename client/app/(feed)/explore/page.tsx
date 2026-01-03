"use client"

import {toast} from "sonner"
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search, Loader2} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {apiClient} from "@/lib/api.client";
import {Profile} from "@/lib/types";

export interface SearchedUser {
    username: string;
    displayName: string;
    image?: string;
}

export default function ExplorePage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await apiClient<ApiResponse<Profile[]>>(`/profiles/search/${query.trim()}`);
            setResults(response.data.map(user => ({
                    username: user.username,
                    displayName: user.displayName,
                    image: user.image || undefined
                })
            ));

        } catch (error) {
            toast("Failed to find users");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-5">
            <div className="p-4 flex gap-4">
                <Input
                    type="text"
                    placeholder="Search username..."
                    className="rounded-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                    className="rounded-full w-12 h-10"
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin"/> : <Search/>}
                </Button>
            </div>

            <div className="mt-4 px-4 space-y-4">
                {results.length > 0 ? (
                    results.map((user) => (
                        <Link
                            href={`/${user.username}`}
                            key={user.username}
                        >
                            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition">
                                <Avatar>
                                    <AvatarImage src={user.image}/>
                                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{user.displayName}</span>
                                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    query && !isLoading && results.length === 0 && (
                        <p className="text-center text-gray-500 text-sm">No users found.</p>
                    )
                )}
            </div>
        </div>
    );
}