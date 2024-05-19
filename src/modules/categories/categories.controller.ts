import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "./categories.entity";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
// import { UniqueCategoryGuard } from "./unique-category.guard";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }
  @Get("/seeder")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async seedCategories(): Promise<string> {
    return await this.categoriesService.seedCategories();
  }
}
