import { getRepository } from 'typeorm';

import { initAuthController } from 'controllers/auth';
import { initRootController } from 'controllers/root';
import { initUserController } from 'controllers/users';
import { dbCreateConnection } from 'orm/dbCreateConnection';
import { User } from 'orm/entities/users/User';

export const init = async () => {
  await dbCreateConnection();

  const userRepository = getRepository(User);

  const userController = initUserController(userRepository);
  const authController = initAuthController(userRepository);
  const rootController = initRootController();

  return {
    userController,
    authController,
    rootController,
  };
};
