import { Module } from '@nestjs/common';
import { PoemsController } from './poems.controller';
import { PoemsService } from './poems.service';

/** 百人一首まわりの部品をひとまとめにするモジュール */
@Module({
  controllers: [PoemsController],
  providers: [PoemsService],
})
export class PoemsModule {}
