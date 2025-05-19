import type { LoginUserRequest, PostDataRequest, PostUpdateRequest, RegisterUserRequest, ResponseBody } from '@/types/index.js';
import { ResponseError } from '@/error/index.js';
import { User, Post } from '@/model/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { Op } from 'sequelize';

export class UserService {
  static async register(request: RegisterUserRequest): Promise<ResponseBody<User>> {
    if (!request.username || !request.fullname || !request.password) throw new ResponseError(400, 'Input cannot empty');

    const isRegistered = await User.findOne({
      where: {
        username: request.username,
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

  static async updatePassword(user: User, newPassword: string): Promise<ResponseBody<string>> {
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
}

export class PostService {
  static async create(value: PostDataRequest, user: User): Promise<ResponseBody<Post>> {
    if (value.title == '' || value.description == '' || value.factory == '' || value.status == '') throw new ResponseError(400, 'Input field cannot empty');

    const post = await Post.create({
      title: value.title,
      description: value.description,
      factory: value.factory,
      status: value.status,
      UserId: user.id,
    });

    return {
      statusCode: 200,
      message: 'Success create post',
      data: post,
    };
  }

  static async getByUsername(user: User): Promise<ResponseBody<Post[]>> {
    const posts = await Post.findAll({
      where: {
        UserId: user.id,
      },
    });

    return {
      statusCode: 200,
      message: 'Post Find',
      data: posts,
    };
  }

  static async getAll(): Promise<ResponseBody<Post[]>> {
    const post = await Post.findAll({
      include: [
        {
          attributes: ['fullname', 'nik', 'username'],
          model: User,
        },
      ],
    });
    if (post.length === 0) throw new ResponseError(404, 'Post not found');
    return {
      statusCode: 200,
      message: 'All Post',
      data: post,
    };
  }

  static async update(updateData: PostUpdateRequest, postIdQuery: string): Promise<ResponseBody<string>> {
    const post = await Post.findOne({
      where: {
        id: Number(postIdQuery),
      },
    });

    if (!post) throw new ResponseError(404, 'not found');

    const affected = await Post.update(
      {
        title: updateData.title == '' ? post.title : updateData.title,
        description: updateData.description == '' ? post.description : updateData.description,
        factory: updateData.factory == '' ? post.factory : updateData.factory,
        status: updateData.status == '' ? post.status : updateData.status,
      },
      {
        where: {
          id: Number(postIdQuery),
        },
      }
    );

    if (affected[0] < 0) throw new ResponseError(400, 'Error during update');

    return {
      statusCode: 200,
      message: 'OK',
      data : 'Updated'
    }
  }

  static async delete(postIdQuery: string): Promise<ResponseBody<string>> {
    const affected = await Post.destroy({
      where: {
        id: Number(postIdQuery),
      },
    });

    if (affected < 0) throw new ResponseError(400, 'Error during delete process');

    return {
      statusCode: 200,
      message: 'OK',
      data: `Post id : ${postIdQuery} deleted`,
    };
  }
}

export class PasswordService {
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
