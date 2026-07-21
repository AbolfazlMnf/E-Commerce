import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewCommentDto } from '../dtos/new-comment.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { CommentService } from '../services/comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { CommentQueryDto } from '../dtos/comment-query.dto';
import { BodyIdPipe } from 'src/shared/pipes/body-id.pipe';

@ApiTags('Site Comment')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('site/comment')
export class SiteCommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  async createNewComment(
    @Body(new BodyIdPipe([`product`])) body: NewCommentDto,
    @User() user: string,
  ) {
    return this.commentService.createNewComment(body, user);
  }

  @Get()
  findAll(@Query() queryParams: CommentQueryDto) {
    return this.commentService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }
}
