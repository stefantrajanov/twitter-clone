"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/shared/ModeToggle";
import {Home, User, Search} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import PostTweet from "@/components/shared/PostTweet";
import * as React from "react";
import SignOutButton from "@/components/shared/SignOutButton";

interface SidebarProps {
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    className?: string;
}

export default function Sidebar({displayName, username, avatarUrl, className}: SidebarProps) {
    const profileLink = username ? `/${username}` : "/login";

    return (
        <div className={cn("flex flex-col h-full p-4 border-border w-[250px]", className)}>
            <div className="text-2xl font-bold mb-8 pl-4">TwitterClone <ModeToggle variant="ghost"/></div>

            <nav className="flex flex-col gap-4 flex-1">
                <Link href="/"
                      className="flex items-center gap-3 text-lg p-3 hover:bg-accent rounded-full transition-colors">
                    <Home className="w-6 h-6"/>
                    <span>Home</span>
                </Link>
                <Link href={profileLink}
                      className="flex items-center gap-3 text-lg p-3 hover:bg-accent rounded-full transition-colors">
                    <User className="w-6 h-6"/>
                    <span>Profile</span>
                </Link>
                <Link href="/explore"
                      className="flex items-center gap-3 text-lg p-3 hover:bg-accent rounded-full transition-colors">
                    <Search className="w-6 h-6"/>
                    <span>Explore</span>
                </Link>
                <Dialog>
                    <DialogTrigger className="bg-primary w-full rounded-full text-lg h-12 cursor-pointer">
                        <span style={{color: "var(--accent)"}}>Tweet</span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tweet</DialogTitle>
                        </DialogHeader>
                        <PostTweet/>
                    </DialogContent>
                </Dialog>
            </nav>


            <div className="flex items-center gap-4">
                {username && displayName ? (
                        <>
                            <Link href={`/${username}`}>
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={avatarUrl}/>
                                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex flex-col text-sm">
                                <Link href={`/${username}`}>
                                    <span className="font-bold hover:underline">{displayName}</span>
                                </Link>
                                <Link href={`/${username}`}>
                                    <span className="text-muted-foreground hover:underline">@{username}</span>
                                </Link>
                            </div>
                            <SignOutButton/>
                        </>
                    ) :
                    (
                        <Link href="/login" className="w-full">
                            <Button className="w-full rounded-full text-lg h-12">Sign In</Button>
                        </Link>
                    )
                }
            </div>
        </div>
    );
}