import { Module } from '@nestjs/common';
import { KimarijiController } from './kimariji.controller';
import { KimarijiService } from './kimariji.service';

@Module({
  controllers: [KimarijiController],
  providers: [KimarijiService],
})
export class KimarijiModule {}
