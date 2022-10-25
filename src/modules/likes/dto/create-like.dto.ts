import { IsNotEmpty, IsInt, IsEnum } from "class-validator";
import { EmojiType, EMOJI_MESSAGE, EMOJI_OPTION } from '../../../utilities/common'
export class CreateLikeDto {

    @IsEnum(EMOJI_OPTION, EMOJI_MESSAGE)
    @IsNotEmpty()
    readonly type: EmojiType;

    @IsInt()
    @IsNotEmpty()
    readonly article: number;

    user: number;
}
