import {notFound} from "next/navigation";
import {Metadata} from "next";
import ProfilePicture from "@/app/(feed)/[username]/_components/ProfilePicture";
import {Calendar} from "lucide-react";
import TweetList from "@/components/shared/TweetList";
import {fetchUserDataByUsername, fetchUserFollowCountByUsername, isCurrentLoggedUser, UserData} from "@/app/(feed)/utils";
import BackButton from "@/components/shared/BackButton";
import {EditProfileDialog} from "@/app/(feed)/[username]/_components/EditProfileDialog";
import FollowButton from "@/app/(feed)/[username]/_components/FollowButton";
import {getMonthName} from "@/lib/utils";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {username} = await params;
    return {
        title: `${username} | TwitterClone`,
        description: `View the profile for ${username}`,
    };
}

export default async function ProfilePage({params}: PageProps) {
    const {username} = await params;
    const userData: UserData | null = await fetchUserDataByUsername(username);
    const isCurrentUser = await isCurrentLoggedUser(username);
    const {following, followers} = await fetchUserFollowCountByUsername(username);

    if (!userData) {
        notFound();
    }

    return (
        <>
            <div className="p-3 border-b-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <BackButton/>
                        <h1 className="text-xl font-bold">{userData.username}</h1>
                    </div>
                    {isCurrentUser ?
                        <EditProfileDialog {...userData}/>
                        :
                        (
                            <FollowButton username={userData.username} />
                        )
                    }

                </div>
                <div className="p-1 flex items-center justify-between">
                    <ProfilePicture username={userData.username} url={userData.image}/>
                </div>
                <div className="p-1">
                    <h2 className="text-2xl font-bold">{userData.displayName}</h2>
                    <p className="text-gray-500">@{userData.username}</p>
                    <p className="mt-3">{userData.biography}</p>
                    <p className="mt-2 flex text-gray-500 gap-1 text-sm items-center">
                        <Calendar className="w-4 h-4"/>Joined {getMonthName(userData.createdAt!.getMonth())} {userData.createdAt!.getFullYear()}
                    </p>
                    <div className="mt-3 text-sm">
                        <span className="mr-4"><strong>{following}</strong> <span
                            className="text-gray-500">Following</span></span>
                        <span><strong>{followers}</strong><span
                            className="text-gray-500"> Followers</span></span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <TweetList userId={userData?.id}/>
            </div>
        </>
    );
}
