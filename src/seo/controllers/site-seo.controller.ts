import { Controller, Get, Query } from '@nestjs/common';
import { SeoService } from '../services/seo.service';
import { SeoQueryDto } from '../dtos/seo.query';

@Controller('site-seo')
export class SiteSeoController {
  constructor(private readonly seoService: SeoService) {}
  @Get()
  findOne(@Query() queries: SeoQueryDto) {
    return this.seoService.findOneWithUrl(queries.url);
  }
}
