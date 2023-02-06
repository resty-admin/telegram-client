import { Start, Update } from "nestjs-telegraf";
import { STICKERS } from "src/app/shared/constants";

import { environment } from "../../../../environments/environment";
import { IStateContext } from "../../../shared";

const text = `Привет 👋🏼 
Я - твой онлайн официант, Resty!  

Хочешь сделать заказ, забронировать стол в заведении, или ты готов оплатить свой счет?

Я здесь для того, чтобы сделать это быстро и удобно 🙌🏼
`;

@Update()
export class BotUpdate {
	@Start()
	async start(context: IStateContext) {
		console.log('start');
		if (environment.production) {
			await context.replyWithSticker(STICKERS.hello);
		}
		await context.reply(text, {
			reply_markup: {
				inline_keyboard: [[{ text: "Открыть", web_app: { url: environment.appUrl } }]]
			}
		});
	}
}
