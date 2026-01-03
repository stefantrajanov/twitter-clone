export interface UserProfile {
    username: string;
    displayName: string;
    biography: string;
    registeredAt: Date;
    followersCount?: number;
    followingCount?: number;
}