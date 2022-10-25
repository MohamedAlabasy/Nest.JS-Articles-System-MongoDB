import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/database/entities/users.entity';
import { CreateUsersDto } from './dto/create-users.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) { }

    // #=======================================================================================#
    // #			                         create new user                                   #
    // #=======================================================================================#
    async createNewUser(_userData: CreateUsersDto): Promise<Users> {
        const data = this.usersRepository.create({
            name: _userData.name,
            email: _userData.email,
            password: _userData.password,
            is_verification: false,
        });
        return await this.usersRepository.save(data);
    }
    // #=======================================================================================#
    // #			                    activate user account                                  #
    // #=======================================================================================#
    async activateUserAccount(_userID: number) {
        return await this.usersRepository.update({ id: _userID }, { is_verification: true })
    }

    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    async login(_userData: LoginDto): Promise<Users> {
        return await this.usersRepository.findOne({
            where: { email: _userData.email }, select: {
                id: true,
                name: true,
                email: true,
                is_verification: true,
                password: true
            }
        });
    }

    // #=======================================================================================#
    // #                         get User by email for forgot password                         #
    // #=======================================================================================#
    async getUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOneBy({ email });
    }

    // #=======================================================================================#
    // #                                  reset User password                                  #
    // #=======================================================================================#
    async resetUserPassword(id: number, password: string) {
        return await this.usersRepository.update({ id }, { password })
    }

    // #=======================================================================================#
    // #                                     get User by id                                    #
    // #=======================================================================================#
    async getUserById(id: number): Promise<Users> {
        return await this.usersRepository.findOneBy({ id });
    }
}
