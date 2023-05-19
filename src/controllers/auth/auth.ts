import { NextFunction, Router, Request, Response } from 'express';

import { checkJwt } from 'middleware/checkJwt';
import { validatorChangePassword, validatorLogin, validatorRegister } from 'middleware/validation/auth';
import { AuthService } from 'services/auth';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class AuthController {
  private authService: AuthService;

  private router: Router;

  constructor(authService: AuthService) {
    this.router = Router();
    this.authService = authService;

    this.router.get('/', this.get.bind(this));
    this.router.post('/login', [validatorLogin], this.login.bind(this));
    this.router.post('/register', [validatorRegister], this.register.bind(this));
    this.router.post('/change-password', [checkJwt, validatorChangePassword], this.changePassword.bind(this));
  }

  public getRouter() {
    return this.router;
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    return res.status(200).send({ test: `hello` });
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { email, password } = req.body;

    try {
      const token = await this.authService.login({ email, password });
      return res.status(200).send({ token: `Bearer ${token}` });
    } catch (err) {
      if ('httpStatusCode' in err) {
        return next(err);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, err);
      return next(customError);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { email, password } = req.body;

    try {
      const result = await this.authService.register({
        email,
        password,
      });

      return res.status(201).send(result);
    } catch (error) {
      if ('httpStatusCode' in error) {
        return next(error);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, error);
      return next(customError);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { password, passwordNew } = req.body;
    const { id } = req.jwtPayload;
    try {
      const result = await this.authService.changePassword(id.toString(), password, passwordNew);
      return res.status(201).send(result);
    } catch (error) {
      if ('httpStatusCode' in error) {
        return next(error);
      }

      const customError = new CustomError(500, 'Raw', 'Error', null, error);
      return next(customError);
    }
  }
}
