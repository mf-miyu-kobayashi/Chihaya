import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pool } from './chihaya/database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Next(3000) と API(3001) はオリジンが違うため、
  // ブラウザからの取得を許可する
  app.enableCors({ origin: 'http://localhost:3000' });

  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connection successful!');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
  }

  await app.listen(3001);
}
bootstrap();
