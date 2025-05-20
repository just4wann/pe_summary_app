import type { ResponseBody } from '@/types/index.js';
import ResponseError from '@/error/index.js';
import User from '@/model/user.model.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export default class PasswordService {
  static async findUser(userInfo: string): Promise<ResponseBody<string>> {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: userInfo,
          },
          {
            nik: userInfo,
          },
        ],
      },
    });

    if (!user) throw new ResponseError(404, `User with username or nik : ${userInfo} not found`);

    return {
      statusCode: 200,
      message: 'OK',
      data: userInfo,
    };
  }

  static async updatePassword(userInfo: string, newPassword: string): Promise<ResponseBody<string>> {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: userInfo,
          },
          {
            nik: userInfo,
          },
        ],
      },
    });

    if (!user) throw new ResponseError(404, `User not found`);

    const isPasswordSame = await bcrypt.compare(newPassword, user.password);

    if (isPasswordSame) throw new ResponseError(400, 'Thats your old password dude, try something else.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePassword = await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          username: user.username,
        },
      }
    );

    if (updatePassword[0] < 0) throw new ResponseError(400, 'Error during change password');

    return {
      statusCode: 200,
      message: 'OK',
      data: 'Success change password',
    };
  }
}