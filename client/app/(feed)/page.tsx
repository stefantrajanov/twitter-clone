import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {fetchUserData, UserData} from "@/app/(feed)/utils";
import TweetList from "@/components/shared/TweetList";
import PostTweet from "@/components/shared/PostTweet";

export default async function HomePage() {
    const userData: UserData | null = await fetchUserData()

    return (
        <main className="flex flex-col">
            <div className="flex justify-between sticky top-0 z-10 backdrop-blur-md bg-background/60 border-b border-border p-4">
                    <Button size="lg" variant="ghost" className="font-bold">
                        For you
                    </Button>
                <div>
                    <Button size="lg" variant="ghost" className="font-bold">
                        Following
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 p-4 border-b border-border">
                <Avatar className={"w-12 h-12"}>
                    <AvatarImage src={userData?.image}/>
                    <AvatarFallback>{userData?.username ? userData?.username.charAt(0).toUpperCase() : "ME"}</AvatarFallback>
                </Avatar>
                <PostTweet/>
            </div>

            <div className="flex flex-col">
                <TweetList/>
            </div>
        </main>
    );
}