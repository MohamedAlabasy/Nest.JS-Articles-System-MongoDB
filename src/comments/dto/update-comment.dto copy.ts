import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    readonly comment: string;

    user: string;
}
