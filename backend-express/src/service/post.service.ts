import type { PostDataRequest, PostUpdateRequest, ResponseBody } from '@/types/index.js';
import ResponseError from '@/error/index.js';
import User from '@/model/user.model.js';
import Post from '@/model/post.model.js';

export default class PostService {
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