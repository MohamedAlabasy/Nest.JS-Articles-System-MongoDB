import { IsNotEmpty, IsInt, IsUUID } from "class-validator";

export class CreateEmailActivateDto {

    @IsInt()
    @IsNotEmpty()
    readonly code: number;

    @IsUUID()
    @IsNotEmpty()
    readonly user: string;
}
