import { Module } from '@nestjs/common';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResultsService } from './quiz-results.service';

/** クイズの回答結果・学習統計まわりのモジュール */
@Module({
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultsModule {}
