import { Request, Response, Router } from 'express';

export class RootController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.get('/', RootController.index);
  }

  getRouter(): Router {
    return this.router;
  }

  /**
   * GET /
   * Home
   */
  static index(_: Request, res: Response): Response {
    return res.status(200).header('Content-Type', 'text/html').send(`<h4>💊 RESTful API boilerplate</h4>`);
  }
}
