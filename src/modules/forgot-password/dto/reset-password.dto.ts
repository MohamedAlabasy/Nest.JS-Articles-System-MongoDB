import { IsNotEmpty, IsInt, IsString, IsEmail, Length, Matches } from "class-validator";
import { PASSWORD_RULE, PASSWORD_MESSAGE } from "../../../utilities/common";

export class ResetPasswordDto {

    @IsInt()
    @IsNotEmpty()
    readonly code: number;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(8, 24)
    @Matches(PASSWORD_RULE, PASSWORD_MESSAGE)
    @IsNotEmpty()
    readonly password: string;
}
