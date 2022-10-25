import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';


import { User } from './schema/user.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    // #=======================================================================================#
    // #			                         create new user                                   #
    // #=======================================================================================#
    async createNewUser(_userData: CreateUsersDto): Promise<User> {
        return this.userModel.create({
            _id: (Math.random() * 1000).toString(),
            name: _userData.name,
            email: _userData.email,
            password: _userData.password,
            is_verification: false,
        })
    }
    // #=======================================================================================#
    // #			                    activate user account                                  #
    // #=======================================================================================#
    async activateUserAccount(_userID: number): Promise<User> {
        return await this.userModel.findByIdAndUpdate({ _id: _userID }, { is_verification: true })
    }

    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    async login(_userData: LoginDto): Promise<User> {
        return await this.userModel.findOne({ email: _userData.email }).select('+password -__v')
    }

    // #=======================================================================================#
    // #                         get User by email for forgot password                         #
    // #=======================================================================================#
    async getUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email });
    }

    // #=======================================================================================#
    // #                                  reset User password                                  #
    // #=======================================================================================#
    async resetUserPassword(id: string, password: string): Promise<User> {
        return await this.userModel.findByIdAndUpdate({ _id: id }, { password })
    }

    // #=======================================================================================#
    // #                                     get User by id                                    #
    // #=======================================================================================#
    async getUserById(_id: string): Promise<User> {
        return await this.userModel.findOne({ _id });
    }
}
