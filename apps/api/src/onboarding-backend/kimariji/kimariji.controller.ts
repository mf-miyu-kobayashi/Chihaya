import { Controller, Get, Param } from '@nestjs/common';
import { KimarijiEntry, KimarijiService } from './kimariji.service';

@Controller('kimariji')
export class KimarijiController {
  constructor(private readonly kimarijiService: KimarijiService) {}

  @Get()
  findAll(): KimarijiEntry[] {
    return this.kimarijiService.findAll();
  }

  @Get(':text')
  search(@Param('text') text: string): KimarijiEntry[] {
    return this.kimarijiService.search(text);
  }
}
