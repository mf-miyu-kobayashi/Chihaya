import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Poem, PoemsService } from './poems.service';

/** URL の先頭が /poems で始まるリクエストをこのクラスが受け持つ */
@Controller('poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  /** GET /poems : 100首の一覧 */
  @Get()
  findAll(): Promise<Poem[]> {
    return this.poemsService.findAll();
  }

  /**
   * GET /poems/search/kimariji/:text : 決まり字で検索
   *
   * 【重要】この定義は下の :id より必ず先に書く。
   * NestJS は上から順にURLを照合するため、:id を先に書くと
   * /poems/search が「id = search」として扱われてしまう（仕様25章の注意点）。
   */
  @Get('search/kimariji/:text')
  searchByKimariji(@Param('text') text: string): Promise<Poem[]> {
    return this.poemsService.searchByKimariji(text);
  }

  /** GET /poems/:id : 1首の詳細 */
  @Get(':id')
  async findOne(
    // ParseIntPipe は URL の文字列 "17" を数値 17 に変換する。
    // 数値でない値が来たら 400 エラーを自動で返してくれる。
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Poem> {
    const poem = await this.poemsService.findOne(id);
    // 見つからないときは 404 を返す（画面側でメッセージを出し分けるため）
    if (!poem) {
      throw new NotFoundException(`第${id}首は見つかりませんでした`);
    }
    return poem;
  }
}
