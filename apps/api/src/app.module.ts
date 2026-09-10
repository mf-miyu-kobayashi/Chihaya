import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './chihaya/favorites/favorites.module';
import { PoemsModule } from './chihaya/poems/poems.module';
import { QuizResultsModule } from './chihaya/quiz-results/quiz-results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // chihaya（百人一首学習アプリ「かるた道場」）の機能
    PoemsModule,
    FavoritesModule,
    QuizResultsModule,
  ],
})
export class AppModule {}
