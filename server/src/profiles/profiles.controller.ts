import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {ProfilesService} from './profiles.service';
import {CreateProfileDto} from './dto/create-profile.dto';
import {UpdateProfileDto} from './dto/update-profile.dto';
import {Profile} from "../database/schema";
import {User} from "../common/user.decorator";

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {
    }

    @Post()
    create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
        return this.profilesService.create(createProfileDto);
    }

    @Get()
    findAll(): Promise<Profile[]> {
        return this.profilesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Profile> {
        return this.profilesService.findOne(id);
    }

    @Get('username/:username')
    findOneByUsername(@Param('username') username: string): Promise<Profile> {
        return this.profilesService.findOneByUsername(username);
    }

    @Get('search/:username')
    findAllSimilarUsernames(@Param('username') username: string): Promise<Profile[]> {
        return this.profilesService.findAllSimilarUsernames(username);
    }

    @Get('suggestions/list')
    getProfileSuggestions(): Promise<Profile[]> {
        return this.profilesService.getProfileSuggestions();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @User() user: any): Promise<Profile> {
        console.log("Updating profile for user:", updateProfileDto);
        return this.profilesService.update(id, updateProfileDto, user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<Profile[]> {
        return this.profilesService.remove(id);
    }
}
