import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

type CreateFavoriteBody = { poemId: number };

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /** GET /favorites : お気に入り一覧 */
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  /** POST /favorites : お気に入り登録 */
  @Post()
  create(@Body() body: CreateFavoriteBody) {
    if (typeof body?.poemId !== 'number' || !Number.isInteger(body.poemId)) {
      throw new BadRequestException('poemId は整数で指定してください');
    }
    return this.favoritesService.create(body.poemId);
  }

  /**
   * DELETE /favorites/:id : お気に入り削除
   *
   * ここでの :id は「favorites テーブルのID」であって、歌のIDではない。
   * 画面側は GET /favorites で取得した id を使って削除する。
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.favoritesService.remove(id);
    if (!deleted) {
      throw new NotFoundException('お気に入りが見つかりませんでした');
    }
    return { id };
  }
}
