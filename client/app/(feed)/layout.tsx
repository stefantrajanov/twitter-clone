import Sidebar from "@/components/shared/Sidebar";
import MobileSidebar from "@/components/shared/MobileSidebar";
import {Profile} from "@/lib/types";
import {fetchRandomUserFollowSuggestions, fetchUserData, UserData} from "./utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

export default async function FeedLayout({children,}: { children: React.ReactNode; }) {
    const userData: UserData | null = await fetchUserData()
    const randomSuggestions: Profile[] = await fetchRandomUserFollowSuggestions();

    return (
        <div className="flex justify-center min-h-screen bg-background text-foreground">
            <MobileSidebar {...userData} />

            <div className="flex w-full max-w-[1200px]">
                <div className="w-[275px] hidden md:block">
                    <div className="fixed h-full w-[275px]">
                        <Sidebar {...userData} />
                    </div>
                </div>

                <div className="w-full max-w-[600px] border-l border-r border-border min-h-screen pb-20 md:pb-0">
                    {children}
                </div>

                <div className="flex-1 hidden lg:block p-4 pl-8">
                    <div className="border rounded-2xl h-[400px] w-full p-4">
                        <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                        {randomSuggestions.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div>
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={profile.image!} alt={profile.displayName}/>
                                            <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="ml-3">
                                        <Link href={`/${profile.username}`}>
                                            <p className="font-semibold text-sm hover:underline">{profile.displayName}</p>
                                        </Link>
                                        <Link href={`/${profile.username}`}>
                                            <p className="text-muted-foreground text-sm hover:underline">@{profile.username}</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                        }

                        {randomSuggestions.length === 0 && (
                            <p className="text-sm text-muted-foreground">Log in to get suggestions.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}