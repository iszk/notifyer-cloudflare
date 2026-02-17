/**
 * Discord Webhook の実行ペイロード
 * @see https://discord.com/developers/docs/resources/webhook#execute-webhook-jsonform-params
 */
export interface DiscordWebhookPayload {
    /** 最大 2000 文字のメッセージ本文 */
    content?: string;
    /** Webhook のデフォルト名を上書きする名前 */
    username?: string;
    /** Webhook のデフォルトのアイコンを上書きする画像 URL */
    avatar_url?: string;
    /** メッセージをテキスト読み上げ (TTS) するか */
    tts?: boolean;
    /** 埋め込みリッチコンテンツ (最大 10 個まで) */
    embeds?: DiscordEmbed[];
    /** メンションの制御設定 */
    allowed_mentions?: {
        parse?: ("roles" | "users" | "everyone")[];
        roles?: string[];
        users?: string[];
        replied_user?: boolean;
    };
    /** メッセージに含めるコンポーネント（ボタンなど。※Bot 以外からの実行には制限あり） */
    components?: any[];
    /** メッセージにフラグを設定（例: 64 はエフェメラル） */
    flags?: number;
    /** 送信後に適用するスレッド名（フォーラムチャンネルなどの場合） */
    thread_name?: string;
}

export interface DiscordEmbed {
    title?: string;
    description?: string;
    /** https:// などの URL */
    url?: string;
    /** ISO8601 形式のタイムスタンプ */
    timestamp?: string;
    /** 10 進数のカラーコード (例: 0xff0000 は 16711680) */
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
    };
    image?: {
        url: string;
    };
    thumbnail?: {
        url: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    /** 最大 25 個まで */
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
}

/**
 * Webhookを送信する関数
 */
export async function sendWebhook(url: string, data: DiscordWebhookPayload) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
    }
}
