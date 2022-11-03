import { IsNotEmpty, IsString, IsEmail, Length, Matches } from "class-validator";
import { PASSWORD_MESSAGE, PASSWORD_RULE } from "src/utilities/common";

export class CreateUsersDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(8, 24)
    @Matches(PASSWORD_RULE, PASSWORD_MESSAGE)
    @IsNotEmpty()
    readonly password: string;
}
