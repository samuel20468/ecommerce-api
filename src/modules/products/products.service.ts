import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { ProductDto } from "./dtos/createProduct.dto";
import { Category } from "../categories/categories.entity";
import * as productsData from "../../seedData/ecommerce-products.json";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: { stock: MoreThan(0) },
      relations: {
        category: true,
      },
    });

    if (products.length == 0) throw new NotFoundException("No products found");

    const start = (page - 1) * limit;
    const end = start + limit;
    const listProducts = products.slice(start, end);

    return listProducts;
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) throw new BadRequestException("id is required");
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async createProduct(product: ProductDto): Promise<Product> {
    const categoryFound = await this.categoryRepository.findOneBy({
      id: product.category,
    });

    if (!categoryFound)
      throw new BadRequestException("A category is needed to create a product");

    const newProduct = new Product();
    newProduct.name = product.name;
    newProduct.description = product.description;
    newProduct.price = product.price;
    newProduct.stock = product.stock;
    newProduct.imgUrl = product.imgUrl;
    newProduct.category = categoryFound;

    return await this.productsRepository.save(newProduct);
  }

  async updateProduct(
    id: string,
    newProduct: UpdateProductDto,
  ): Promise<Product> {
    if (!id) {
      throw new BadRequestException("id is required");
    }
    const existingProduct = await this.productsRepository.findOneBy({ id });
    if (!existingProduct) {
      throw new NotFoundException("Product not found");
    }

    if (newProduct.category) {
      const foundCategory = await this.categoryRepository.findOneBy({
        id: newProduct.category,
      });

      if (!foundCategory)
        throw new ConflictException(
          "Can't update category with a non-existent",
        );
      delete newProduct.category;
      existingProduct.category = foundCategory;
    }

    Object.assign(existingProduct, newProduct);
    return await this.productsRepository.save(existingProduct);
  }
  async deleteProduct(id: string): Promise<Product> {
    if (!id) {
      throw new BadRequestException("id is required");
    }
    const productToDelete = await this.productsRepository.findOneBy({ id });
    if (!productToDelete) {
      throw new NotFoundException("Product not found");
    }

    await this.productsRepository.remove(productToDelete);

    return productToDelete;
  }

  async seedProducts(): Promise<string> {
    for (const productData of productsData) {
      const { name, description, price, stock, imgUrl, category } = productData;
      if (!name || !description || !price || !stock || !imgUrl || !category) {
        throw new BadRequestException("All fields are required for product.");
      }

      const foundCategory = await this.categoryRepository.findOne({
        where: { name: category },
      });

      const newProduct = new Product();
      newProduct.name = name;
      newProduct.description = description;
      newProduct.price = price;
      newProduct.stock = stock;
      newProduct.imgUrl = imgUrl;
      newProduct.category = foundCategory;

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(newProduct)
        .orUpdate(["description", "price", "imgUrl", "stock"], ["name"])
        .execute();
    }

    return "Products seeded succesfully";
  }
}
