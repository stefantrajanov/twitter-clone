export class UpdateProfileDto {
    readonly username: string;
    readonly displayName: string;
    readonly biography?: string;
    readonly image?: string;
}
