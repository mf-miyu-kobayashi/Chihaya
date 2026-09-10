import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';

/** POST で受け取るデータの形 */
type CreateQuizResultBody = {
  poemId: number;
  isCorrect: boolean;
};

@Controller('quiz-results')
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  /** GET /quiz-results : 学習履歴（回答結果の一覧） */
  @Get()
  findAll() {
    return this.quizResultsService.findAll();
  }

  /**
   * GET /quiz-results/statistics : 学習統計
   *
   * この定義が @Get() より後ろでも問題ないのは、@Get() がパス無しの
   * 完全一致だから。ただし将来 :id を足すときは、必ずこの下に書くこと。
   */
  @Get('statistics')
  getStatistics() {
    return this.quizResultsService.getStatistics();
  }

  /**
   * GET /quiz-results/weak-poems?limit=20 : 苦手な歌（正解率が低い順）
   *
   * 「苦手な歌だけでクイズ」で使う。
   * URL の ?limit=20 は文字列で届くため、数値に変換してから渡す。
   */
  @Get('weak-poems')
  findWeakPoems(@Query('limit') limit?: string) {
    const parsed = Number(limit);
    return this.quizResultsService.findWeakPoems(
      Number.isInteger(parsed) && parsed > 0 ? parsed : 20,
    );
  }

  /** POST /quiz-results : 回答結果を1件登録する */
  @Post()
  create(@Body() body: CreateQuizResultBody) {
    // 受け取った値が想定どおりか確認する。
    // 不正な値をそのままDBに渡さないためのチェック。
    if (typeof body?.poemId !== 'number' || !Number.isInteger(body.poemId)) {
      throw new BadRequestException('poemId は整数で指定してください');
    }
    if (typeof body?.isCorrect !== 'boolean') {
      throw new BadRequestException('isCorrect は true / false で指定してください');
    }
    return this.quizResultsService.create(body.poemId, body.isCorrect);
  }
}
