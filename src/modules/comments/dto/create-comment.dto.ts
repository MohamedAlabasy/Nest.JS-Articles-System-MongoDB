import { IsNotEmpty, IsString, Length, IsInt } from "class-validator";

export class CreateCommentDto {

    @Length(3, 255, { message: 'comment must be longer than 3 characters' })
    @IsString()
    @IsNotEmpty()
    readonly comment: string;

    @IsInt()
    @IsNotEmpty()
    readonly article: number;

    user: number;
}
