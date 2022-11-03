import { IsNotEmpty, IsString, Length, IsUUID } from "class-validator";

export class CreateCommentDto {

    @Length(3, 255, { message: 'comment must be longer than 3 characters' })
    @IsString()
    @IsNotEmpty()
    readonly comment: string;

    @IsUUID()
    @IsNotEmpty()
    readonly article: string;

    user: string;
}
