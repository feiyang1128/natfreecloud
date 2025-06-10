async function runCheckin(env, TGID=0) {
  const checkinUrl = 'https://nat.freecloud.ltd/addons?_plugin=19&_controller=index&_action=index';
  const { UID, TG_BOT_TOKEN, TG_CHAT_ID } = env;
  const USERID = TGID || UID;
  if (!USERID) {
    throw new Error('缺少必要的 UID 环境变量');
  }
  const checkinRes = await fetch(checkinUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ uid: USERID }).toString()
  });
 
  const checkinJson = await checkinRes.json();
 
  if (TG_BOT_TOKEN && TG_CHAT_ID) {
    const tgMessage = `📥 签到结果\n状态码: ${checkinRes.status}\n信息: ${checkinJson?.msg || '无返回信息'}`;
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: tgMessage
      })
    });
  }
 
  return checkinJson;
}
 
export default {
  // 定时触发使用
  async scheduled(event, env) {
    await runCheckin(env);
  },
 
  async fetch(request, env) {
    let text = '';
    const url = new URL(request.url);
 
    // 安全解析 JSON，避免中断
    let update = {};
    try {
      if (request.headers.get("content-type")?.includes("application/json")) {
        update = await request.json();
      }
    } catch (e) {
    }
    text = update?.message?.text?.trim() || '';
    const [command, id] = text.split(/\s+/);
    // GET / 或 POST /telegram 且 /checkin 指令
    if ((url.pathname === '/' && request.method === 'GET') ||
      (request.method === 'POST' && url.pathname === '/telegram' && command === '/checkin')) {
      const result = await runCheckin(env, Number(id));
      return new Response(JSON.stringify({
        message: "✅ 手动触发成功",
        result
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }
 
    // GET 非根路径
    if (url.pathname !== '/' && request.method === 'GET') {
      return new Response('Not Found', { status: 404 });
    }
 
    // 其他情况发送提示消息到 Telegram
    if (env.TG_BOT_TOKEN && env.TG_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TG_CHAT_ID,
          text: "🤖 发送 /checkin 来执行签到操作"
        })
      });
    }
 
    return new Response('OK');
  }
 
};
 
 
