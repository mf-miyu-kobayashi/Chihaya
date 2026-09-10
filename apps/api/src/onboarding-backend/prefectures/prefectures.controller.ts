import { Controller, Get } from '@nestjs/common';
import { Prefecture, PrefecturesService } from './prefectures.service';

// @Controller('prefectures') で、このクラスが受け持つURLの入口が
// /prefectures になる
@Controller('prefectures')
export class PrefecturesController {
  // service は new せず、コンストラクタで受け取る（NestJS が渡してくれる）
  constructor(private readonly prefecturesService: PrefecturesService) {}

  // @Get() なので GET /prefectures を担当する。
  // 返した配列は NestJS が自動で JSON に変換してレスポンスにする
  @Get()
  findAll(): Prefecture[] {
    return this.prefecturesService.findAll();
  }
}
