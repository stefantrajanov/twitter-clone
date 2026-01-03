import {Inject, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DATABASE_CONNECTION } from '../database/database.connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {eq, like} from 'drizzle-orm';
import {Profile} from "../database/schema";
import * as schema from "../database/schema";
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Injectable()
export class ProfilesService {
  constructor(
      @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const [newProfile] = await this.db
        .insert(schema.profiles)
        .values(createProfileDto)
        .returning();

    return newProfile;
  }

  async findAll(): Promise<Profile[]>  {
    return this.db.query.profiles.findMany({});
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(schema.profiles.id, id),
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findOneByUsername(username: string): Promise<Profile> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(schema.profiles.username, username),
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findAllSimilarUsernames(username: string): Promise<Profile[]> {
    return this.db.select()
        .from(schema.profiles)
        .where(like(schema.profiles.username, `%${username}%`));
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, userId : string): Promise<Profile>  {
    if (id !== userId) {
      throw new UnauthorizedException();
    }

    const [updated] = await this.db
        .update(schema.profiles)
        .set(updateProfileDto)
        .where(eq(schema.profiles.id, id))
        .returning();

    return updated;
  }

  async remove(id: string): Promise<Profile[]>  {
    return this.db
        .delete(schema.profiles)
        .where(eq(schema.profiles.id, id))
        .returning();
  }

  async getProfileSuggestions() {
    return this.db.query.profiles.findMany({
      limit: 5,
    });
  }
}