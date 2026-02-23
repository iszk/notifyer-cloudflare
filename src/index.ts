import { Hono } from 'hono'
import { sendWebhook, DiscordWebhookPayload } from "./discord"

type Bindings = {
    API_KEY: string
    SECRET: string
    DISCORD_WEBHOOK_SMS: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => {
    return c.json({ ok: true, service: 'notifyer-cloudflare' })
})

app.get('/ping', (c) => {
    return c.text('pong')
})

app.post('/sms', async (c) => {
    const resp: { ok: boolean; send_to_discord?: boolean } = { ok: true }
    const body = await c.req.parseBody()
    const secret = typeof body.secret === 'string' ? body.secret : ''

    if (secret !== c.env.SECRET) {
        return c.json({ ok: false, error: 'unauthorized' }, 401)
    }

    const message = typeof body.message === 'string' ? body.message : ''
    const number = typeof body.number === 'string' ? body.number : ''
    const sim = typeof body.sim === 'string' ? body.sim : ''

    console.log('message:', message)
    console.log('number:', number)
    console.log('sim:', sim)

    if (c.env.DISCORD_WEBHOOK_SMS) {
        const payload: DiscordWebhookPayload = {
            content: `From: ${number} / ${sim}\n${message}`,
        }
        await sendWebhook(c.env.DISCORD_WEBHOOK_SMS, payload)
        resp['send_to_discord'] = true
    }

    return c.json(resp)
})

export default app
