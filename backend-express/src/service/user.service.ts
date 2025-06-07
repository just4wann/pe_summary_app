import type { LoginUserRequest, RegisterUserRequest, ResponseBody, UserProfileUpdateRequest } from '@/types/index.js';
import ResponseError from '@/error/index.js';
import User from '@/model/user.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { Op } from 'sequelize';

export default class UserService {
  static async register(request: RegisterUserRequest): Promise<ResponseBody<User>> {
    if (!request.username || !request.fullname || !request.password || !request.nik) throw new ResponseError(400, 'Input cannot empty');

    const isRegistered = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: request.username
          },
          {
            nik: request.nik
          }
        ]
      },
    });

    if (isRegistered) throw new ResponseError(400, 'Username already registered');

    request.password = await bcrypt.hash(request.password, 10);

    const user: User = await User.create({
      nik: request.nik,
      username: request.username,
      fullname: request.fullname,
      password: request.password,
    });

    return {
      statusCode: 200,
      message: `Success create account`,
      data: user,
    };
  }

  static async login(request: LoginUserRequest): Promise<ResponseBody<User>> {
    if (!request.user || !request.password) throw new ResponseError(400, 'Input cannot empty');

    const isUserRegistered = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: request.user,
          },
          {
            nik: request.user,
          },
        ],
      },
    });

    if (!isUserRegistered) throw new ResponseError(401, 'Username or Password is wrong');

    const comparePassword: boolean = await bcrypt.compare(request.password, isUserRegistered.password);

    if (!comparePassword) throw new ResponseError(401, 'Username or Password is wrong');

    const generateToken = uuidV4({}, undefined, 20);

    const updateUserToken = await User.update(
      {
        token: generateToken,
      },
      {
        where: {
          [Op.or]: [
            {
              username: request.user,
            },
            {
              nik: request.user,
            },
          ],
        },
      }
    );

    if (updateUserToken[0] < 0) throw new ResponseError(400, 'Error during login process');

    isUserRegistered.token = generateToken;

    return {
      statusCode: 200,
      message: 'Login success',
      data: isUserRegistered,
    };
  }

  static async logout(user: User): Promise<ResponseBody<string>> {
    const deleteUserToken = await User.update(
      {
        token: '',
      },
      {
        where: {
          username: user.username,
        },
      }
    );

    if (deleteUserToken[0] < 0) throw new ResponseError(400, 'Error during logout process');

    return {
      statusCode: 200,
      message: 'OK',
      data: 'Logout Success',
    };
  }

  static async getAll(): Promise<ResponseBody<User[]>> {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullname', 'nik'],
    });
    return {
      statusCode: 200,
      message: 'Success get Users',
      data: users,
    };
  }

  static async get(userToken: string): Promise<ResponseBody<User>> {
    const user = await User.findOne({
      attributes: ['id', 'username', 'fullname', 'nik'],
      where: {
        token: userToken,
      },
    });
    if (!user) throw new ResponseError(404, 'User not found');

    return {
      statusCode: 200,
      message: 'Success get user',
      data: user,
    };
  }

  static async update(user: User, updateData: UserProfileUpdateRequest): Promise<ResponseBody<string>> {
    const affected = await User.update(
      {
        fullname: updateData.fullname === '' ? user.fullname : updateData.fullname,
        username: updateData.username === '' ? user.username : updateData.username,
        nik: updateData.nik === '' ? user.nik : updateData.nik
      },
      {
        where: {
          id: user.id
        }
      }
    )
    if (affected[0] < 0) throw new ResponseError(400, 'Error during update user');

    return {
      statusCode: 200,
      message: 'OK',
      data: 'User Updated'
    }
  }
}