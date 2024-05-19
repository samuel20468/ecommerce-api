import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dtos/createUser.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { Role } from "./role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dtos/update-user.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAllUsers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 5,
  ) {
    return this.usersService.getAllUsers({ page, limit });
  }
  @Get("/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUserById(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch("modify/:id")
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async modifyUserRole(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.modifyUser(id);
  }

  @Put("/updateUser/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUser(
    @Body() user: UpdateUserDto,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const newUser: UpdateUserDto = user;
    return this.usersService.updateUser(id, newUser);
  }
  @Delete("/deleteUser/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteUser(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
