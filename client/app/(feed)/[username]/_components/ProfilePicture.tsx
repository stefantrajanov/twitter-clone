import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface ProfilePictureProps {
    url?: string;
    username: string;
}

export default function ProfilePicture({url, username}: ProfilePictureProps) {
    return (
        <Avatar style={{width: '100px', height: '100px', fontSize: '3rem'}}>
            <AvatarImage
                src={url} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}