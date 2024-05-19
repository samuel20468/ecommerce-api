import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "../auth/guards/auth.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("files")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiTags("products")
  @Post("uploadImage/:id")
  @ApiOperation({ summary: "Uploads a single file" })
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadImage(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif|svg)/,
          }),
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: "El archivo no debe ser mayor a 200kb",
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if(!file) throw new BadRequestException("You must provide a file!") //hay validación por defecto, pero no sé de donde viene
    return await this.cloudinaryService.uploadImage(id, file);
  }
}
