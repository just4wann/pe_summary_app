import type { LoginUserRequest, PostDataRequest, RegisterUserRequest, ResponseBody } from '@/types/index.js';
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
        [Op.or] : [
          {
            username: request.user
          },
          {
            nik: request.user
          }
        ]
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
              username: request.user
            },
            {
              nik: request.user
            }
          ]
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

  static async getAll(): Promise<ResponseBody<User[]>> {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullname', 'nik']
    });
    return {
      statusCode: 200,
      message: 'Success get Users',
      data: users
    }
  }

  static async get(userToken: string): Promise<ResponseBody<User>> {
    const user = await User.findOne({
      attributes: ['id', 'username', 'fullname', 'nik'],
      where: {
        token: userToken
      },
    })
    if (!user) throw new ResponseError(404, 'User not found');

    return {
      statusCode: 200,
      message: 'Success get user',
      data: user
    }
  }
}

export class PostService {
  static async create(value: PostDataRequest, userToken: string): Promise<ResponseBody<Post>> {
    if (value.title == '' || value.description == '' || value.factory == '' || value.status == '') throw new ResponseError(400, 'Input field cannot empty')
    const user = await User.findOne({
      where: {
        token: userToken,
      },
    });

    if (!user) throw new ResponseError(404, 'User not found')

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

  static async getByUsername(userToken: string): Promise<ResponseBody<User[]>> {
    const user = await User.findOne({
      where: {
        token: userToken,
      },
    });

    if (!user) throw new ResponseError(404, 'User not found')

    const post = await User.findAll({
      attributes: ['username', 'fullname'],
      where: {
        id: user.id,
      },
      include: [
        {
          model: Post,
        },
      ],
    });

    return {
      statusCode: 200,
      message: 'Post Find',
      data: post,
    };
  }

  static async getAll(): Promise<ResponseBody<Post[]>> {
    const post = await Post.findAll({
      include: [
        {
          attributes: ["fullname", "nik"],
          model: User
        }
      ]
    });
    if (post.length === 0) throw new ResponseError(404, 'Post not found');
    return {
      statusCode: 200,
      message: 'All Post',
      data: post
    }
  }
}
