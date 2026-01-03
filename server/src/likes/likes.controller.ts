import { Controller, Post, Body, Delete, Query, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import {User} from "../common/user.decorator";

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @User() user: any) {
    return this.likesService.create(createLikeDto.tweetId, user.id);
  }

  // DELETE /likes?tweetId=1
  @Delete()
  remove(@Query('tweetId') tweetId: string, @User() user: any) {
    return this.likesService.remove(+tweetId, user.id);
  }

  // GET /likes/check?tweetId=1
  @Get('check')
  checkLike(@Query('tweetId') tweetId: string, @User() user: any) {
      return this.likesService.checkLike(+tweetId, user.id);
  }
}