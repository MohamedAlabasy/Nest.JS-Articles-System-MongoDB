import { IsNotEmpty, IsEnum, IsUUID } from "class-validator";
import { EmojiType, EMOJI_MESSAGE, EMOJI_OPTION } from "src/utilities/common";
export class CreateLikeDto {

    @IsEnum(EMOJI_OPTION, EMOJI_MESSAGE)
    @IsNotEmpty()
    readonly type: EmojiType;

    @IsUUID()
    @IsNotEmpty()
    readonly article: string;

    user: string;
}
