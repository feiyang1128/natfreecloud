
# natfreecloud 自动签到 （cloudflare workers）

## 变量说明

| 变量名称              | 示例值  | 描述                            |
|-----------------------|---------|---------------------------------|
| UID                   | 10      | 用户ID：获取方法见下图         |
| TG_BOT_TOKEN（可选） | 12345   | Telegram 机器人 token          |
| TG_CHAT_ID（可选）   | 12345   | Telegram 你的 chat ID          |

![image](https://github.com/user-attachments/assets/96582fc5-a738-4552-992f-e8b364aa9707)

> 红框后面的数字就是 ID

---

## 手动签到  
1、首先添加一个自定义域名<br>
   浏览器访问 ： https://自定义域名  即可。<br>
2、支持 TG 机器人签到 <br>
   浏览器访问：[TG](https://api.telegram.org/bot<TG机器人token>/setWebhook?url=https://自定义域/telegram)  (仅一次即可)<br>
   发送  /checkin ID(ID可选)  签到
## 自动签到
   添加一个触发事件即可。
