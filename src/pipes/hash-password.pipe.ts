import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';


@Injectable()
export class HashPasswordPipe implements PipeTransform {
  transform(value: CreateUsersDto, metadata: ArgumentMetadata) {
    return {
      ...value,
      password: bcrypt.hashSync(value.password, 10)
    }
  }
}
