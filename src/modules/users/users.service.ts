import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { User } from './schema/user.schema';
import { CreateUsersDto } from './dto/create-users.dto';
// import { LoginDto } from './dto/login.dto';
import { SELECT } from 'src/utilities/common';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    // #=======================================================================================#
    // #			                         create new user                                   #
    // #=======================================================================================#
    async createNewUser(_userData: CreateUsersDto): Promise<User> {
        return this.userModel.create({
            _id: uuidv4(),
            name: _userData.name,
            email: _userData.email,
            password: _userData.password,
            is_verification: false,
            is_admin: false
        })
    }
    // #=======================================================================================#
    // #			                    activate user account                                  #
    // #=======================================================================================#
    async activateUserAccount(_id: string): Promise<User> {
        return await this.userModel.findByIdAndUpdate({ _id }, { is_verification: true }, { new: true })
    }

    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    async login(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).select(`+password ${SELECT}`)
    }

    // #=======================================================================================#
    // #                         get User by email for forgot password                         #
    // #=======================================================================================#
    async getUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).select(SELECT);
    }

    // #=======================================================================================#
    // #                                  reset User password                                  #
    // #=======================================================================================#
    async resetUserPassword(_id: string, password: string): Promise<User> {
        return await this.userModel.findByIdAndUpdate({ _id }, { password }).select(SELECT);
    }

    // #=======================================================================================#
    // #                                     get User by id                                    #
    // #=======================================================================================#
    async getUserById(_id: string): Promise<User> {
        return await this.userModel.findOne({ _id }).select(SELECT);
    }

    // #=======================================================================================#
    // #                                      get all Users                                    #
    // #=======================================================================================#
    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find().select(SELECT);
    }
}
