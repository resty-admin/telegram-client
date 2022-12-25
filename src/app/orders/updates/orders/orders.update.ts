import { InjectBot, Update } from "nestjs-telegraf";
import { IOrder } from "src/app/shared";
import { OrdersEvents } from "src/app/shared/constants";
import { OnSocketEvent } from "src/app/shared/socket-io";
import { Telegraf } from "telegraf";

@Update()
export class OrdersUpdate {
	constructor(@InjectBot() private readonly _bot: Telegraf) {}

	@OnSocketEvent(OrdersEvents.CONFIRM_ORDER)
	async displayOrder(order: IOrder) {
		try {
			const { table, products, users } = order;

			const text = `
Ваш заказ за стол ${table.code} <b>Подтвержден</b>

<b>Блюда:</b>

${products.reduce((_text, { product, quantity }) => `${_text}${quantity}x	${product.name}	${product.price}грн\n`, "")}

<b>Гости:</b>

${users.reduce((_text, { user }) => `${_text}${user.name}\n`, "")}
`;

			for (const { user } of users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, { parse_mode: "HTML" });
			}

			return "done";
		} catch (error) {
			console.error(error);
		}
	}

	@OnSocketEvent(OrdersEvents.CONFIRM_PAYMENT)
	async displayPayment(order: IOrder) {
		try {
			const { table, products, users } = order;

			const sum = products.reduce((pre, { product, quantity }) => pre + product.price * quantity, 0);

			const text = `
Оплата <b>Наличными</b> за столом: ${table.code} на сумму <b>${sum}грн подтверждена</b>. 

<b>Блюда:</b>

${products.reduce((_text, { product, quantity }) => `${_text}${quantity}x	${product.name}	${product.price}грн\n`, "")}

<b>Гости:</b>

${users.reduce((_text, { user }) => `${_text}${user.name}\n`, "")}
`;

			for (const { user } of users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, { parse_mode: "HTML" });
			}

			return "done";
		} catch (error) {
			console.error(error);
		}
	}
}
