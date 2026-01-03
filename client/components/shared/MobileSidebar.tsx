"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MobileSidebarProps {
    displayName?: string;
    username?: string;
    image?: string;
}

export default function MobileSidebar({ displayName, username, image }: MobileSidebarProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full md:hidden z-50"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px]">
                <VisuallyHidden.Root>
                    <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden.Root>

                <Sidebar
                    displayName={displayName}
                    username={username}
                    image={image}
                    className="w-full border-none"
                />
            </SheetContent>
        </Sheet>
    );
}