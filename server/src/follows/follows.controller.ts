import { Controller, Post, Body, Delete, Query, Get, Param } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import {User} from "../common/user.decorator";
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  create(@Body() createFollowDto: CreateFollowDto, @User() user: any) {
    return this.followsService.create(user.id, createFollowDto);
  }

  // DELETE /follows?=followingUsername=them
  @Delete()
  remove(@User() user: any, @Query('followingUsername') followingUsername: string) {
    return this.followsService.remove(user.id, followingUsername);
  }

  @Get(':username')
  isFollowing(@User() user: any, @Param('username') username: string) {
    return this.followsService.isFollowing(user.id, username);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Get(":username/followers/count")
  async getFollowersCount(@Param("username") username: string) {
      return this.followsService.getFollowersCountByUsername(username);
  }

  @Get(":username/following/count")
  async getFollowingCount(@Param("username") username: string) {
      return this.followsService.getFollowingCountByUsername(username);
  }
}