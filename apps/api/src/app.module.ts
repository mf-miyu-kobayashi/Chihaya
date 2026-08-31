import { Module } from '@nestjs/common';
import { PrefecturesModule } from './prefectures/prefectures.module';

@Module({
  imports: [PrefecturesModule],
})
export class AppModule {}
