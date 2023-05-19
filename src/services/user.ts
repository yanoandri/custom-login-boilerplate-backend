import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export interface IUpdateUser {
  username: string;
  name: string;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  public async destroy(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`]);
      throw customError;
    }
    return this.userRepository.delete(id);
  }

  public async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
    });

    if (!user) {
      const customError = new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
      throw customError;
    }

    return user;
  }

  public async list(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
    });
  }

  public async edit(id: string, user: IUpdateUser): Promise<UpdateResult> {
    return this.userRepository.update(id, {
      username: user.username,
      name: user.name,
    });
  }
}
