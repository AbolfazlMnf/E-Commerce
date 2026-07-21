import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentStatus } from '../schemas/comment.schema';
import { Model } from 'mongoose';
import { CommentQueryDto } from '../dtos/comment-query.dto';
import { NewCommentDto } from '../dtos/new-comment.dto';
import { sortOrder } from 'src/shared/dtos/query.dto';
import { getOrderOption } from 'src/shared/utils/order';
import { getSortOption } from 'src/shared/utils/sort';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async createNewComment(body: NewCommentDto, user: string) {
    const { content, product } = body;
    const newComment = new this.commentModel({
      content: content,
      product: product,
      user: user,
      status: CommentStatus.Pending,
    });

    await newComment.save();
    return newComment;
  }

  async findAll(queryParams: CommentQueryDto, selectObject: any = { __v: 0 }) {
    const {
      limit = 10,
      page = 1,
      user,
      sort,
      order = sortOrder.Desc,
      status,
      content,
      product,
    } = queryParams;

    const query: any = {};
    if (content) query.content = { $regex: content, $options: 'i' };
    if (user) query.user = user;
    if (status) query.status = status;
    if (product) query.product = product;

    const orderOption = getOrderOption(order);
    const sortObj = getSortOption(orderOption, sort);

    const comments = await this.commentModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', { firstName: 1, lastName: 1, mobile: 1 })
      .populate('product', { title: 1, thumbnail: 1 })
      .sort(sortObj)
      .select(selectObject)
      .exec();

    const count = await this.commentModel.countDocuments(query);

    return { count, comments };
  }

  async findOne(id: string, selectObject: any = { __v: 0 }) {
    const comment = await this.commentModel
      .findOne({ _id: id })
      .populate('user', { firstName: 1, lastName: 1 })
      .populate('product', { title: 1, thumbnail: 1 })
      .select(selectObject)
      .exec();

    if (comment) {
      return comment;
    } else {
      throw new NotFoundException();
    }
  }

  async changeCommentStatus(id: string, status: CommentStatus) {
    const comment = await this.commentModel.findOne({ _id: id }).exec();

    if (comment) {
      comment.status = status;
      await comment.save();
    } else {
      throw new NotFoundException();
    }
  }
}
