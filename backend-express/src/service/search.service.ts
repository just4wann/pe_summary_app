import Post from '@/model/post.model.js';
import User from '@/model/user.model.js';
import { ResponseBody, SearchQuery } from '@/types/index.js';
import { Op } from 'sequelize';

export default class SearchService {
  public static async search(query: SearchQuery): Promise<ResponseBody<Post[]>> {
    if (!query.q)
      return {
        statusCode: 404,
        message: 'Not Found',
        data: [],
      };
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${query.q}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query.q}%`,
            },
          },
          {
            factory: {
              [Op.iLike]: `%${query.q}%`,
            },
          },
          {
            status: {
              [Op.iLike]: `%${query.q}%`,
            },
          },
        ],
      },
      include: {
        model: User,
        attributes: ['id', 'username', 'fullname', 'nik'],
      },
    });

    if (posts.length === 0)
      return {
        statusCode: 404,
        message: 'Not found',
        data: [],
      };
    return {
      statusCode: 200,
      message: 'OK',
      data: posts,
    };
  }
}
