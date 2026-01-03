import {Controller, Post, Body, Delete, Query, Get} from '@nestjs/common';
import { RetweetsService } from './retweets.service';
import { CreateRetweetDto } from './dto/create-retweet.dto';
import {User} from "../common/user.decorator";

@Controller('retweets')
export class RetweetsController {
  constructor(private readonly retweetsService: RetweetsService) {}

  @Post()
  create(@Body() createRetweetDto: CreateRetweetDto, @User() user: any) {
    return this.retweetsService.create(createRetweetDto.tweetId, user.id);
  }

  // DELETE /retweets?tweetId=1
  @Delete()
  remove(@Query('tweetId') tweetId: string, @User() user: any) {
    return this.retweetsService.remove(+tweetId, user.id);
  }

  // GET /likes/check?tweetId=1
  @Get('check')
  checkLike(@Query('tweetId') tweetId: string, @User() user: any) {
    return this.retweetsService.checkRetweet(+tweetId, user.id);
  }
}