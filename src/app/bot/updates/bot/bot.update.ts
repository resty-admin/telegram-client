import { Start, Update } from "nestjs-telegraf";
import { STICKERS } from "src/app/shared/constants";

import { environment } from "../../../../environments/environment";
import { IStateContext } from "../../../shared";

const text = `Привіт 👋🏼
Я - твій онлайн офіціант, Resty!

Хочеш зробити замовлення, забронювати стіл у закладі, чи ти готовий сплатити за свій рахунок?

Я тут для того, щоб зробити це швидко та зручно 🙌🏼`;

@Update()
export class BotUpdate {
	@Start()
	async start(context: IStateContext) {
		if (environment.production) {
			await context.replyWithSticker(STICKERS.hello);
		}

		const endQuery = `${context.startPayload?.includes("?") ? "&" : "?"}from=telegram`;

		await context.reply(text, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Почати", web_app: { url: `${environment.appUrl}${context.startPayload}${endQuery}` } }]
				]
			}
		});
	}
}
