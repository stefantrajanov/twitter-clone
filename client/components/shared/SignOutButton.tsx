"use client"

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {EllipsisVertical} from "lucide-react";
import {authClient} from "@/lib/auth.client";
import * as React from "react";
import {useRouter} from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-auto p-2 rounded-full">
                    <EllipsisVertical className="w-5 h-5"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={ () => authClient.signOut(
                    {
                        fetchOptions: {
                            onSuccess: () => {
                                router.push("/login"); // redirect to login page
                            },
                        },
                    }
                )}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}