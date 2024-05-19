import { Controller, Post, UseGuards } from "@nestjs/common";
import { DataResetService } from "./data-reset.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/role.enum";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("data-reset")
export class DataResetController {
  constructor(private readonly dataResetService: DataResetService) {}

  @ApiTags("data-management")
  @Post("reset")
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async resetData(): Promise<void> {
    await this.dataResetService.resetData();
    console.log("Data restart successfully");
  }
}
