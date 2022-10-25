import { IsNotEmpty, IsUUID } from "class-validator";

export class UnLikeDto {
    @IsUUID()
    @IsNotEmpty()
    readonly user: string;

    @IsUUID()
    @IsNotEmpty()
    readonly article: string;

}
