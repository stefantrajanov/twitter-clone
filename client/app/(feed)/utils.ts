import {authClient} from "@/lib/auth.client";
import {headers} from "next/headers";
import {apiClient} from "@/lib/api.client";
import {Profile} from "@/lib/types";

export interface UserData {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
    image?: string;
    biography?: string;
    createdAt?: Date;
}

export async function fetchUserData(): Promise<UserData | null> {
    const {data: session} = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    });


    if (session) {
        try {
            const {data: profile} = await apiClient<ApiResponse<Profile>>(`/profiles/${session.user.id}`, {
                method: "GET",
                headers: await headers()
            });

            return {
                displayName: profile.displayName,
                username: profile.username,
                id: profile.id,
                biography: profile.biography || undefined,
                image: profile.image || undefined,
                createdAt: profile.createdAt
            }
        } catch (e) {
            console.error("Error fetching user data: " + (e as Error).message);
        }
    }

    return null;
}

export async function fetchUserDataByUsername(username: string): Promise<UserData | null> {
    try {
        const {data: profile} = await apiClient<ApiResponse<Profile>>(`/profiles/username/${username}`, {
            method: "GET",
            headers: await headers()
        });
        if (profile) {
            return {
                displayName: profile.displayName,
                username: profile.username,
                id: profile.id,
                biography: profile.biography || undefined,
                image: profile.image || undefined,
                createdAt: new Date(profile.createdAt)
            }
        }
    } catch (e) {
        console.error("Error fetching user by username: " + (e as Error).message);
    }

    return null;
}

// Checks if this is the currently logged in user
export async function isCurrentLoggedUser(username: string): Promise<boolean> {
    const userData = await fetchUserData();
    return userData?.username === username;
}

export async function fetchUserFollowCountByUsername(username: string): Promise<{
    following: number,
    followers: number
}> {
    try {
        const {data: following} = await apiClient<ApiResponse<number>>(`/follows/${username}/following/count`, {
            method: "GET",
            headers: await headers()
        });

        const {data: followers} = await apiClient<ApiResponse<number>>(`/follows/${username}/followers/count`, {
            method: "GET",
            headers: await headers()
        });

        return {
            following: Number(following),
            followers: Number(followers)
        };
    } catch (e) {
        return {following: 0, followers: 0};
    }
}

export async function fetchRandomUserFollowSuggestions(): Promise<Profile[]> {
    try {
        const {data: suggestions} = await apiClient<ApiResponse<Profile[]>>(`/profiles/suggestions/list`, {
            method: "GET",
            headers: await headers()
        });

        return suggestions;
    } catch (e) {
        return [];
    }
}
