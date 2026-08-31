# オンボーディングプロジェクト

これは新しく入ったメンバーがプロダクト開発チームの開発フローに慣れるためのオンボーディング用プロジェクトです。
pnpm workspaces を使ったモノレポ構成で、フロントエンド([Next.js](https://nextjs.org))とバックエンド([NestJS](https://nestjs.com))を1つのリポジトリにまとめています。

## 必要環境

- Node.js **18.18 以上**
- pnpm 9 系

```bash
corepack enable
```

## はじめかた

依存関係をインストールします。

```bash
pnpm install
```

フロントとバックを両方同時に起動します。

```bash
pnpm dev
```

- Next.js: [http://localhost:3000](http://localhost:3000)
- NestJS API: [http://localhost:3001](http://localhost:3001)

片方だけ起動したいときは以下を使ってください。

```bash
pnpm dev:next    # Next.js のみ
pnpm dev:api     # NestJS のみ
```

## もっと詳しく知りたい人へ

- [Next.js Documentation](https://nextjs.org/docs) — Next.js の機能や API について
- [NestJS Documentation](https://docs.nestjs.com) — Module / Controller / Service の考え方
- [pnpm workspaces](https://pnpm.io/workspaces) — モノレポ構成の仕組み

## 応援メッセージ

ようこそプロダクト開発チームへ！最初は分からないことばかりで戸惑うと思うけど、それは誰もが通る道。
このプロジェクトを触りながら、少しずつ開発の感覚を掴んでいってください。
困ったことがあれば遠慮なく周りを頼って大丈夫。チーム一同、応援しています！
