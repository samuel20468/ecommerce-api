import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginUserDto } from "./dtos/authLogin.dto";
import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dtos/createUser.dto";
import { User } from "../users/users.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../users/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: Omit<UserDto, "confirmPassword">): Promise<User> {
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (existingUser) throw new ConflictException("Email already in use");

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    const newUser = new User();
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.password = hashedPassword;
    newUser.phone = user.phone;
    newUser.country = user.country;
    newUser.address = user.address;
    newUser.city = user.city;

    const createdUser: User = await this.usersService.createUser(newUser);
    if (!createdUser) {
      throw new InternalServerErrorException("Falló la creación del usuario ");
    }

    return createdUser;
  }
  async signin(credentials: LoginUserDto) {
    const { email, password } = credentials;

    const userToCheck = await this.usersService.getUserByEmail(email);
    if (!userToCheck) throw new UnauthorizedException("Invalid Credentials");
    
    const checkPass = await bcrypt.compare(password, userToCheck.password);

    if (!checkPass) throw new UnauthorizedException("Invalid Credentials");

    let role = [];

    if (userToCheck.admin) {
      role.push(Role.ADMIN);
    } 
    if (!userToCheck.admin) {
      role.push(Role.USER);
    } 
    if (userToCheck.superAdmin) {
      role.push(Role.SUPERADMIN);
    }
    const userPayload = {
      id: userToCheck.id,
      email: userToCheck.email,
      roles: [...role],
    };

    const token = this.jwtService.sign(userPayload);

    return { message: "Login succesful", token };
  }
}
