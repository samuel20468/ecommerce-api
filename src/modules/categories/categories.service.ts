import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./categories.entity";

const categories = [
  { name: "smartphone" },
  { name: "monitor" },
  { name: "keyboard" },
  { name: "mouse" },
];
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    if (categories.length == 0)
      throw new NotFoundException("No categories found");

    return categories;
  }
  async seedCategories(): Promise<string> {
    for (const category of categories) {
      if (!category.name) {
        throw new BadRequestException("Category name is required.");
      }
      const existingCategory = await this.categoryRepository.findOneBy({
        name: category.name,
      });
      if (!existingCategory) {
        const newCategory = new Category();
        newCategory.name = category.name;
        await this.categoryRepository.save(newCategory);
      }
    }
    return "Categories seeded successfully.";
  }
}
