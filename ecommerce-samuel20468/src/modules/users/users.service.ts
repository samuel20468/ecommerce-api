import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UserDto } from "./dtos/createUser.dto";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async modifyUser(id: string) {
    const modifiedUser = await this.usersRepository.update(id, { admin: true });
    return modifiedUser
  }

  async getAllUsers({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<User[]> {
    const users: User[] = await this.usersRepository.find();
    if (users.length == 0) throw new NotFoundException("No users found");
    users.forEach((user) => {
      delete user.password;
    });

    page = Math.max(1, page);

    limit = Math.max(1, limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return users.slice(startIndex, endIndex);
  }
  async getUserById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException("id is required");
    }
    const user: User = await this.usersRepository.findOneBy({ id });
    if (user) {
      delete user.password;
      delete user.superAdmin;
      delete user.admin;
      return user;
    }
    throw new NotFoundException("User not found");
  }
  async getUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException("email is required");
    }
    const user: User = await this.usersRepository.findOneBy({ email });

    return user;
  }
  async createUser(user: Omit<UserDto, "confirmPassword">): Promise<User> {
    const createdUser = await this.usersRepository.save(user);
    if (createdUser) {
      delete createdUser.admin;
      delete createdUser.superAdmin;
      delete createdUser.password;

      return createdUser;
    }
    throw new NotFoundException("User not found");
  }
  async updateUser(id: string, newUser: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new BadRequestException("id is required");
    }
    const existingUser: User = await this.usersRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const userToMerge: User = this.usersRepository.merge(existingUser, newUser);

    const updateUser = await this.usersRepository.save(userToMerge);
    if (updateUser) {
      delete updateUser.admin;
      delete updateUser.superAdmin;
      delete updateUser.password;
      return updateUser;
    }
    throw new InternalServerErrorException("Updating User process failed");
  }
  async deleteUser(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException("id is required");
    }
    const userToDelete = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!userToDelete) {
      throw new NotFoundException("User not found");
    }

    if (userToDelete.orders.length > 0)
      throw new ConflictException("Can't delete an user with active orders");

    await this.usersRepository.remove(userToDelete);

    return userToDelete;
  }
}
