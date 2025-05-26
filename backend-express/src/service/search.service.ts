import Post from '@/model/post.model.js';
import User from '@/model/user.model.js';
import { ResponseBody, SearchQuery } from '@/types/index.js';
import { Op } from 'sequelize';

export default class SearchService {
  public static async search(query: SearchQuery): Promise<ResponseBody<Post[]>> {
    let posts: Post[] = [];
    if (query.post == 'true') {
      posts = await Post.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query.q}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${query.q}%`,
              },
            },
            {
              factory: {
                [Op.like]: `%${query.q}%`,
              },
            },
            {
              status: {
                [Op.like]: `%${query.q}%`,
              },
            },
          ],
        },
        include: {
            model: User,
            attributes: ['id', 'username', 'fullname', 'nik']
        }
      });
    }
    return {
      statusCode: 200,
      message: 'OK',
      data: posts,
    };
  }
}
