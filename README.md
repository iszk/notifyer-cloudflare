# notifyer-cloudflare

Cloudflare Workers 上で動く Hono API の最小構成です。

## Requirements

- Node.js 20+（推奨: 20 / 22 LTS）
- npm
- Cloudflare アカウント（deploy時）

## Setup

```bash
npm install
cp .dev.vars.example .dev.vars
```

`.dev.vars` の `API_KEY` はアプリ用の秘密情報です（Cloudflare ログイン情報とは別）。

## Development

```bash
npm run dev
```

Node 25 系では `wrangler dev` のローカルランタイムが不安定なことがあります。`mise` 利用時は以下で LTS に合わせます。

```bash
mise install
mise exec node@22 -- npm run dev
```

- Health check: `GET /health`
- Ping: `GET /ping`

## Discord 送信をスキップする番号

Discord に送信しない番号は [src/skip-discord-numbers.ts](src/skip-discord-numbers.ts) の `SKIP_DISCORD_NUMBERS` で管理します。

```ts
export const SKIP_DISCORD_NUMBERS = new Set<string>([
	'09011112222',
	'+819012345678',
])
```

- `number` と完全一致した場合に Discord 送信をスキップします。

## Cloudflare 側での実行確認

API Token 方式のみを利用します（ローカル・CI で共通化するため）。

`wrangler.toml` の `account_id` はダミー値になっています。実行前に実際の値へ置き換えてください。
`account_id` は通常 32 文字の16進文字列です（例: `0123456789abcdef0123456789abcdef`）。

### 1) API Token を設定

Cloudflare ダッシュボードで API Token を発行し、環境変数に設定します。

```bash
export CLOUDFLARE_API_TOKEN="<your_token>"
npm run cf:whoami
```

Token には少なくとも Workers を操作できる権限が必要です（最小権限推奨）。

### 2) Remote で実行確認

```bash
npm run dev:remote
```

- `npm run dev:remote` 実行後に表示される URL へアクセスして確認します。
- 例: `/health`, `/ping`

### 3) デプロイ確認

```bash
npm run deploy
```

初回は Cloudflare 側に Worker が作成され、`workers.dev` URL が表示されます。

## Type Check

```bash
npm run typecheck
```

## Deploy

```bash
npm run deploy
```

## Future split guideline

ルートや責務が増えたら、以下の順で分離します。

1. `src/app.ts` に app 初期化を移動
2. `src/routes/*` へルート分割
3. `src/services/*` へ業務ロジック分離
