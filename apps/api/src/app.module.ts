import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './chihaya/favorites/favorites.module';
import { PoemsModule } from './chihaya/poems/poems.module';
import { QuizResultsModule } from './chihaya/quiz-results/quiz-results.module';
import { KimarijiModule } from './onboarding-backend/kimariji/kimariji.module';
import { PrefecturesModule } from './onboarding-backend/prefectures/prefectures.module';
import { UsersController } from './onboarding-backend/users.controller';
import { UsersService } from './onboarding-backend/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrefecturesModule,
    KimarijiModule,
    // chihaya（百人一首学習アプリ）の機能
    PoemsModule,
    FavoritesModule,
    QuizResultsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
