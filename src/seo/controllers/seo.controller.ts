import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeoQueryDto } from '../dtos/seo.query';
import { SeoService } from '../services/seo.service';
import { SeoDto, UpdateSeoDto } from '../dtos/seo.dto';

@ApiTags(`Seo`)
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}
  @Get()
  getAll(@Query() query: SeoQueryDto) {
    return this.seoService.findAll(query);
  }

  @Get(`:id`)
  getOne(@Param(`id`) id: string) {
    return this.seoService.findOne(id);
  }
  @Post()
  create(@Body() body: SeoDto) {
    return this.seoService.create(body);
  }
  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() body: UpdateSeoDto) {
    return this.seoService.update(id, body);
  }
  @Delete(`:id`)
  delete(@Param(`id`) id: string) {
    return this.seoService.delete(id);
  }
}
