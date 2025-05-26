import SearchService from '@/service/search.service.js';
import { SearchQuery } from '@/types/index.js';
import type { Request, Response, NextFunction } from 'express';

export default class SearchController {
  public static async search(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const query = req.query as SearchQuery;
      const response = await SearchService.search(query);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
