import { Injectable, OnModuleInit } from "@nestjs/common";
import { CategoriesService } from "../categories/categories.service";
import { ProductsService } from "../products/products.service";

let isInitialized: boolean = false;
@Injectable()
export class PreloadService implements OnModuleInit {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly productService: ProductsService,
  ) {}


  async onModuleInit() {
    if (!isInitialized) {
      console.log("Seed process initiaded!");
      await this.preloadData();
      isInitialized = true;
    }
  }

  async preloadData() {
    await this.categoryService.seedCategories();
    console.log("Categories seeded succesfully!");

    await this.productService.seedProducts();
    console.log("Products seeded succesfully!");
  }
}
