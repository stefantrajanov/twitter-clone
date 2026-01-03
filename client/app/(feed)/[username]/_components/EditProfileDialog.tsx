"use client"

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@radix-ui/react-menu";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {UserData} from "@/app/(feed)/utils";
import {Textarea} from "@/components/ui/textarea";
import {useRef, useState, ChangeEvent} from "react";
import {toast} from "sonner";
import {apiClient} from "@/lib/api.client";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {X} from "lucide-react";

export function EditProfileDialog(userData: UserData) {
    const [displayName, setDisplayName] = useState(userData.displayName);
    const [username, setUsername] = useState(userData.username);
    const [biography, setBiography] = useState(userData.biography || "");
    const [image, setImage] = useState<string | null>(userData.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await apiClient<ApiResponse<never>>(`/profiles/${userData.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    username: username,
                    displayName: displayName,
                    biography: biography,
                    image: image,
                }),
            });

            if (response.success) {
                toast.success("Changes saved!");
                if (userData.username !== username) {
                    router.push(`/${username}`);
                } else {
                    router.refresh();
                }
            } else {
                toast.error("Failed save changes: " + response.error);
            }
        } catch (e) {
            toast.error("An error occurred: " + (e as Error).message);
        }
    }

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit profile</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label>Display Name</Label>
                            <Input id="name-1" name="name"
                                   onChange={(e) => setDisplayName(e.target.value)}
                                   value={displayName}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Username</Label>
                            <Input required id="username-1" name="username"
                                   onChange={(e) => setUsername(e.target.value)}
                                   value={username}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Biography</Label>
                            <Textarea id="biography-1" name="biography"
                                      onChange={(e) => setBiography(e.target.value)}
                                      value={biography} maxLength={500}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Profile Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                            />
                            {image && (
                                <div className="relative w-fit">
                                    <Avatar style={{"width": "200px", "height": "200px"}}>
                                        <AvatarImage src={image}/>
                                        <AvatarFallback>PF</AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => {
                                            setImage(null);
                                            if (fileInputRef.current) fileInputRef.current.value = ''
                                        }}
                                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                                    >
                                        <span className="w-4 h-4">
                                            <X/>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}