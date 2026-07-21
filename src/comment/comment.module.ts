import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, commentSchema } from './schemas/comment.schema';
import { SiteCommentController } from './controllers/site-comment.controller';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: commentSchema,
      },
    ]),
  ],
  controllers: [SiteCommentController, CommentController],
  providers: [CommentService],
})
export class CommentModule {}
