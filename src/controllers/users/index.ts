import { Repository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { UserService } from 'services/user';

import { UserController } from './user';

export const initUserController = (repository: Repository<User>) => {
  const userService = new UserService(repository);
  return new UserController(userService);
};
