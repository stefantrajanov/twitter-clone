import { Module } from '@nestjs/common';
import { RetweetsService } from './retweets.service';
import { RetweetsController } from './retweets.controller';
import {DatabaseModule} from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [RetweetsController],
  providers: [RetweetsService],
})
export class RetweetsModule {}
