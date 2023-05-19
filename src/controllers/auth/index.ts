import { Repository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { AuthService } from 'services/auth';

import { AuthController } from './auth';

export const initAuthController = (repository: Repository<User>) => {
  const authService = new AuthService(repository);
  return new AuthController(authService);
};
