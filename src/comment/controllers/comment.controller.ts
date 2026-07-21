import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CommentQueryDto } from '../dtos/comment-query.dto';
import { CommentStatusDto } from '../dtos/comment-status.dto';
import { Role } from 'src/user/Schema/user.schema';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtGuard, new RoleGuard([Role.Admin]))
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll(@Query() queryParams: CommentQueryDto) {
    return this.commentService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  changeCommentStatus(@Param('id') id: string, @Body() body: CommentStatusDto) {
    return this.commentService.changeCommentStatus(id, body.status);
  }
}
