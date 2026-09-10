import { Injectable } from '@nestjs/common';

export type KimarijiEntry = {
  kimariji: string;
  no: number;
};

export const kimarijiList: KimarijiEntry[] = [
  { kimariji: 'あきの', no: 1 },
  { kimariji: 'はるす', no: 2 },
  { kimariji: 'あし', no: 3 },
  { kimariji: 'たご', no: 4 },
  { kimariji: 'おく', no: 5 },
  { kimariji: 'かさ', no: 6 },
  { kimariji: 'あまの', no: 7 },
  { kimariji: 'わがい', no: 8 },
  { kimariji: 'はなの', no: 9 },
  { kimariji: 'これ', no: 10 },
  { kimariji: 'わたのはらや', no: 11 },
  { kimariji: 'あまつ', no: 12 },
  { kimariji: 'つく', no: 13 },
  { kimariji: 'みち', no: 14 },
  { kimariji: 'きみがためは', no: 15 },
  { kimariji: 'たち', no: 16 },
  { kimariji: 'ちは', no: 17 },
  { kimariji: 'す', no: 18 },
  { kimariji: 'なにわが', no: 19 },
  { kimariji: 'わび', no: 20 },
  { kimariji: 'いまこ', no: 21 },
  { kimariji: 'ふ', no: 22 },
  { kimariji: 'つき', no: 23 },
  { kimariji: 'この', no: 24 },
  { kimariji: 'なにし', no: 25 },
  { kimariji: 'おぐ', no: 26 },
  { kimariji: 'みかの', no: 27 },
  { kimariji: 'やまざ', no: 28 },
  { kimariji: 'こころあ', no: 29 },
  { kimariji: 'ありあ', no: 30 },
  { kimariji: 'あさぼらけあ', no: 31 },
  { kimariji: 'やまが', no: 32 },
  { kimariji: 'ひさ', no: 33 },
  { kimariji: 'たれ', no: 34 },
  { kimariji: 'ひとは', no: 35 },
  { kimariji: 'なつ', no: 36 },
  { kimariji: 'しら', no: 37 },
  { kimariji: 'わすら', no: 38 },
  { kimariji: 'あさじ', no: 39 },
  { kimariji: 'しの', no: 40 },
  { kimariji: 'こい', no: 41 },
  { kimariji: 'ちぎりき', no: 42 },
  { kimariji: 'あい', no: 43 },
  { kimariji: 'おおこ', no: 44 },
  { kimariji: 'あわれ', no: 45 },
  { kimariji: 'ゆら', no: 46 },
  { kimariji: 'やえ', no: 47 },
  { kimariji: 'かぜを', no: 48 },
  { kimariji: 'みかき', no: 49 },
  { kimariji: 'きみがためお', no: 50 },
  { kimariji: 'かく', no: 51 },
  { kimariji: 'あけ', no: 52 },
  { kimariji: 'なげき', no: 53 },
  { kimariji: 'わすれ', no: 54 },
  { kimariji: 'たき', no: 55 },
  { kimariji: 'あらざ', no: 56 },
  { kimariji: 'め', no: 57 },
  { kimariji: 'ありま', no: 58 },
  { kimariji: 'やす', no: 59 },
  { kimariji: 'おおえ', no: 60 },
  { kimariji: 'いにし', no: 61 },
  { kimariji: 'よを', no: 62 },
  { kimariji: 'いまは', no: 63 },
  { kimariji: 'あさぼらけう', no: 64 },
  { kimariji: 'うら', no: 65 },
  { kimariji: 'もろ', no: 66 },
  { kimariji: 'はるの', no: 67 },
  { kimariji: 'こころに', no: 68 },
  { kimariji: 'あらし', no: 69 },
  { kimariji: 'さ', no: 70 },
  { kimariji: 'ゆう', no: 71 },
  { kimariji: 'おと', no: 72 },
  { kimariji: 'たか', no: 73 },
  { kimariji: 'うか', no: 74 },
  { kimariji: 'ちぎりお', no: 75 },
  { kimariji: 'わたのはらこ', no: 76 },
  { kimariji: 'せ', no: 77 },
  { kimariji: 'あわじ', no: 78 },
  { kimariji: 'あきか', no: 79 },
  { kimariji: 'ながか', no: 80 },
  { kimariji: 'ほ', no: 81 },
  { kimariji: 'おも', no: 82 },
  { kimariji: 'よのなかよ', no: 83 },
  { kimariji: 'ながら', no: 84 },
  { kimariji: 'よも', no: 85 },
  { kimariji: 'なげけ', no: 86 },
  { kimariji: 'む', no: 87 },
  { kimariji: 'なにわえ', no: 88 },
  { kimariji: 'たま', no: 89 },
  { kimariji: 'みせ', no: 90 },
  { kimariji: 'きり', no: 91 },
  { kimariji: 'わがそ', no: 92 },
  { kimariji: 'よのなかは', no: 93 },
  { kimariji: 'みよ', no: 94 },
  { kimariji: 'おおけ', no: 95 },
  { kimariji: 'はなさ', no: 96 },
  { kimariji: 'こぬ', no: 97 },
  { kimariji: 'かぜそ', no: 98 },
  { kimariji: 'ひとも', no: 99 },
  { kimariji: 'もも', no: 100 },
];

@Injectable()
export class KimarijiService {
  findAll(): KimarijiEntry[] {
    return kimarijiList;
  }

  search(text: string): KimarijiEntry[] {
    const query = text.trim();
    if (!query) return [];

    return kimarijiList.filter(
      (entry) =>
        entry.kimariji.startsWith(query) || query.startsWith(entry.kimariji),
    );
  }
}
