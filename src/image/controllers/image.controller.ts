import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PublicImageDto } from '../dtos/public-image.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { ImageService } from '../services/image.service';
import { ImageQueryDto } from '../dtos/image-query.dto';

@ApiTags(`General Image`)
@Controller('general/image')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(`all`)
  getAll(@Query() query: ImageQueryDto) {
    return this.imageService.findAll(query);
  }

  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.imageService.findOneImage(id);
  }

  @UseInterceptors(FileInterceptor(`image`))
  @ApiConsumes(`multipart/form-data`)
  @Post()
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20000000,
          }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/png|image\/jpg|image\/webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    body: PublicImageDto,
  ) {
    return this.imageService.saveImage(file, body.folder);
  }
  @Delete(`:id/delete`)
  @ApiOperation({
    summary: `delete images`,
    description: `delete public images`,
  })
  @ApiParam({
    name: `id`,
    description: `id of image`,
    example: `686a4b7b0a1d2c3e4f5a6b7c`,
  })
  deleteImage(@Param(`id`) id: string) {
    return this.imageService.deleteImage(id);
  }
}
