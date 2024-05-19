import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dtos/authLogin.dto";
import { UserDto } from "../users/dtos/createUser.dto";
import { User } from "../users/users.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post("signin")
  signin(@Body() credentials: LoginUserDto) {
    const {email, password} = credentials
    return this.authService.signin({email, password});
  }
  @Post("signUp")
  async signup(@Body() user: UserDto): Promise<User> {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      address,
      city,
      country,
    } = user;
  
    const passwordsValidations = password === confirmPassword;
  
    if (!passwordsValidations)
      throw new BadRequestException("Las contraseñas deben coincidir");
  
    const createdUser = await this.authService.signup({
      name,
      email,
      password,
      phone,
      address,
      city,
      country,
    });
  
    return createdUser;
  }
}
