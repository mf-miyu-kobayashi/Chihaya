import { Module } from '@nestjs/common';
import { PrefecturesController } from './prefectures.controller';
import { PrefecturesService } from './prefectures.service';

@Module({
  // 外からのリクエストを受け取る入口
  controllers: [PrefecturesController],
  // controller に注入される処理・データ
  providers: [PrefecturesService],
})
export class PrefecturesModule {}
