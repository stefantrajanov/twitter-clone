export class CreateTweetDto {
    readonly content: string;
    readonly image?: string;
    readonly parentTweetId?: number;
}