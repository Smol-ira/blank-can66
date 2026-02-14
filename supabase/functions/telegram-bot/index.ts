const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string, parseMode = 'HTML') {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
  return res.json();
}

async function handleUpdate(update: any) {
  const message = update.message;
  if (!message?.text) return;

  const chatId = message.chat.id;
  const text = message.text;
  const firstName = message.from?.first_name || 'Пользователь';

  if (text === '/start') {
    await sendMessage(
      chatId,
      `👋 Привет, <b>${firstName}</b>!\n\nДобро пожаловать! Я бот для Telegram Mini App.\n\nИспользуйте /help для списка команд.`
    );
  } else if (text === '/help') {
    await sendMessage(
      chatId,
      `📋 <b>Доступные команды:</b>\n\n/start - Начать работу\n/help - Список команд\n/app - Открыть Mini App`
    );
  } else if (text === '/app') {
    await sendMessage(
      chatId,
      `🚀 Нажмите кнопку ниже, чтобы открыть Mini App!`
    );
  } else {
    await sendMessage(
      chatId,
      `Вы написали: <i>${text}</i>\n\nИспользуйте /help для списка команд.`
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Handle webhook setup request
    if (body.action === 'set-webhook') {
      const webhookUrl = body.webhook_url;
      const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle Telegram updates
    const update = body;
    await handleUpdate(update);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
