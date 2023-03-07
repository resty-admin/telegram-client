import { Start, Update } from "nestjs-telegraf";
import { STICKERS } from "src/app/shared/constants";

import { environment } from "../../../../environments/environment";
import { IStateContext } from "../../../shared";

const text1 = `Привіт 👋🏼
Я - твій онлайн офіціант, Resty!

Хочеш зробити замовлення, забронювати стіл у закладі, чи ти готовий сплатити за свій рахунок?

Я тут для того, щоб зробити це швидко та зручно 🙌🏼`;

const text2 = `Привіт 👋🏼
Я - твій онлайн офіціант, Resty!

Бачу, ти вже визначився зі столиком

Переходь додаток і я допоможу тобі оформити замовлення`;

@Update()
export class BotUpdate {
	@Start()
	async start(context: IStateContext) {
		if (environment.production) {
			await context.replyWithSticker(STICKERS.hello);
		}

		const [placeId, code] = (context.startPayload || "").split("_");

		const url = placeId && code ? `/places/${placeId}/connect-to-table?code=${code}&from=telegram` : "?from=telegram";

		await context.reply(code ? text2 : text1, {
			reply_markup: {
				inline_keyboard: [[{ text: "Почати", web_app: { url: `${environment.appUrl}${url}` } }]]
			}
		});
	}
}
