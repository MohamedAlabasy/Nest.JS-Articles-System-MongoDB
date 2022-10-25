import { IsNotEmpty, IsString, IsEmail, Length, Matches } from "class-validator";
import { PASSWORD_RULE, PASSWORD_MESSAGE } from "../../../utilities/common";

export class CreateUsersDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;


    @IsNotEmpty()
    @IsString()
    @Length(8, 24)
    @Matches(PASSWORD_RULE, PASSWORD_MESSAGE)
    readonly password: string;
}
