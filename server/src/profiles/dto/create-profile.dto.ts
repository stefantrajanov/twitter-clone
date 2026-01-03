export class CreateProfileDto {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly email: string;
    readonly biography?: string;
    readonly image?: string;
}
