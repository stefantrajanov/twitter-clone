import {Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from '../database/schema';
import {User} from "../common/user.decorator";
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  create(@Body() createTweetDto: CreateTweetDto, @User() user: any): Promise<Tweet> {
    return this.tweetsService.create(createTweetDto, user.id);
  }

  @AllowAnonymous()
  @Get()
  findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.tweetsService.findAll(page, limit);
  }

  @Get(':userId')
  findAllByUser(
      @Param('userId') userId: string,
  ) {
    return this.tweetsService.findAllByUser(userId);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string): Promise<Tweet> {
    return this.tweetsService.findOne(+id);
  }

  @Get('comments/:tweetId')
  findComments(@Param('tweetId') tweetId: string): Promise<Tweet[]> {
    return this.tweetsService.findComments(+tweetId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto): Promise<Tweet> {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any): Promise<Tweet[]> {
    return this.tweetsService.remove(+id, user.id);
  }
}