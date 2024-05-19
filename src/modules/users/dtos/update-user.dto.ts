import { ApiHideProperty, PartialType } from "@nestjs/swagger";
import { UserDto } from "./createUser.dto";

export class UpdateUserDto extends PartialType(UserDto) {}
