import { Injectable, NotFoundException } from "@nestjs/common";
import { UploadApiResponse, v2 } from "cloudinary";
import toStream = require("buffer-to-stream");
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../products/products.entity";
import { Repository } from "typeorm";

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}
  async uploadImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    const productToUpdate = await this.productsRepository.findOneBy({
      id,
    });
    if (!productToUpdate)
      throw new NotFoundException(
        "The product to which the image was to be posted or updated is not found.",
      );
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
            this.productsRepository.update(productToUpdate.id, {
              imgUrl: result.secure_url,
            });
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
