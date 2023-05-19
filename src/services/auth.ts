import { Repository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export interface IAuthUser {
  email: string;
  password: string;
}

export class AuthService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  public async changePassword(id: string, password: string, passwordNew: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [`User not found.`]);
      throw customError;
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(400, 'General', 'Not Found', ['Incorrect password']);
      throw customError;
    }

    user.password = passwordNew;
    user.hashPassword();
    return this.userRepository.save(user);
  }

  public async register(registeredUser: IAuthUser): Promise<User> {
    const { email, password } = registeredUser;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const customError = new CustomError(400, 'General', 'User already exists', [
        `Email '${user.email}' already exists`,
      ]);
      throw customError;
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.hashPassword();
    return this.userRepository.save(newUser);
  }

  async login(existingUser: IAuthUser): Promise<string> {
    const { email, password } = existingUser;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', ['User not found']);
      throw customError;
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      throw customError;
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      created_at: user.created_at,
    };

    return createJwtToken(jwtPayload);
  }
}
