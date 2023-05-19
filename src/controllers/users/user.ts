import { Router, Request, Response, NextFunction } from 'express';

import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorEdit } from 'middleware/validation/users';
import { UserService } from 'services/user';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class UserController {
  private userService: UserService;

  private router: Router;

  constructor(userService: UserService) {
    this.userService = userService;

    this.router = Router();
    this.router.get('/', [checkJwt, checkRole(['ADMINISTRATOR'])], this.list.bind(this));
    this.router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], this.show.bind(this));
    this.router.patch(
      '/:id([0-9]+)',
      [checkJwt, checkRole(['ADMINISTRATOR'], true), validatorEdit],
      this.edit.bind(this),
    );
    this.router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMINISTRATOR'], true)], this.delete.bind(this));
  }

  public getRouter() {
    return this.router;
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const users = await this.userService.list();
      return res.status(200).send(users);
    } catch (err) {
      if ('httpStatusCode' in err) {
        return next(err);
      }

      const customError = new CustomError(500, 'Raw', `Can't retrieve list of users.`, null, err);
      return next(customError);
    }
  }

  public async show(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;

    try {
      const user = await this.userService.getById(id);

      res.customSuccess(200, 'User found', user);
    } catch (err) {
      if ('httpStatusCode' in err) {
        return next(err);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, err);
      return next(customError);
    }
  }

  public async edit(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const { username, name } = req.body;

    try {
      const user = await this.userService.edit(id, { username, name });

      res.customSuccess(201, 'User updated', null);
    } catch (err) {
      if ('httpStatusCode' in err) {
        return next(err);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, err);
      return next(customError);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;

    try {
      const user = await this.userService.destroy(id);

      res.customSuccess(204, 'User deleted', null);
    } catch (err) {
      if ('httpStatusCode' in err) {
        return next(err);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, err);
      return next(customError);
    }
  }
}
