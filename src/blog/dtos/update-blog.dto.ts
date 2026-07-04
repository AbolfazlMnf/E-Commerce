import { PartialType } from '@nestjs/swagger';
import { BlogDto } from './blog.dto';

export class UpdateBlogDto extends PartialType(BlogDto) {}
