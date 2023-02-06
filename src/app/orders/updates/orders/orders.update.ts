import { InjectBot, Update } from "nestjs-telegraf";
import { OrdersEvents } from "src/app/shared/constants";
import { OnSocketEvent } from "src/app/shared/socket-io";
import { Telegraf } from "telegraf";

import { IOrderEvent, IOrderPtosEvent } from "../../../shared/interfaces/orders/order-created.interface";

@Update()
export class OrdersUpdate {
	constructor(@InjectBot() private readonly _bot: Telegraf) {}

	@OnSocketEvent(OrdersEvents.CANCELED)
	async orderClosedNotifyWaiter(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		try {
			const { orderNumber, table, type } = orderEvent.order;

			const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b> отменен. 
`;
			for (const user of orderEvent.order.users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	@OnSocketEvent(OrdersEvents.REJECTED)
	async orderRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		try {
			const { orderNumber, table, type } = orderEvent.order;

			const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Страви: ${
				(orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name), "")
			} скасовані офіціантом.
`;
			for (const user of orderEvent.order.users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	@OnSocketEvent(OrdersEvents.APPROVED)
	async orderApprovedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		try {
			const { orderNumber, table, type } = orderEvent.order;

			const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Страви: ${
				(orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name), "")
			}  підтверджені офіціантом.
`;
			for (const user of orderEvent.order.users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	@OnSocketEvent(OrdersEvents.TABLE_APPROVED)
	async orderTableApprovedNotifyWaiter(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		try {
			const { orderNumber, table, type } = orderEvent.order;

			const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Бронювання столу підтверджено офіціантом.
`;
			for (const user of orderEvent.order.users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	@OnSocketEvent(OrdersEvents.TABLE_REJECTED)
	async orderTableRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		try {
			const { orderNumber, table, type } = orderEvent.order;

			const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Бронювання столу скасовано офіціантом.
`;
			for (const user of orderEvent.order.users) {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	// 	@OnSocketEvent(OrdersEvents.CONFIRM_ORDER)
	// 	async displayOrder(order: IOrder) {
	// 		try {
	// 			const { table, products, users } = order;
	//
	// 			const text = `
	// Ваш заказ за стол ${table.code} <b>Подтвержден</b>
	//
	// <b>Блюда:</b>
	//
	// ${products.reduce((_text, { product, quantity }) => `${_text}${quantity}x	${product.name}	${product.price}грн\n`, "")}
	//
	// <b>Гости:</b>
	//
	// ${users.reduce((_text, { user }) => `${_text}${user.name}\n`, "")}
	// `;
	//
	// 			for (const { user } of users) {
	// 				await this._bot.telegram.sendMessage(user.telegramId, text, { parse_mode: "HTML" });
	// 			}
	//
	// 			return "done";
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	//
	// 	@OnSocketEvent(OrdersEvents.CONFIRM_PAYMENT)
	// 	async displayPayment(order: IOrder) {
	// 		try {
	// 			const { table, products, users } = order;
	//
	// 			const sum = products.reduce((pre, { product, quantity }) => pre + product.price * quantity, 0);
	//
	// 			const text = `
	// Оплата <b>Наличными</b> за столом: ${table.code} на сумму <b>${sum}грн подтверждена</b>.
	//
	// <b>Блюда:</b>
	//
	// ${products.reduce((_text, { product, quantity }) => `${_text}${quantity}x	${product.name}	${product.price}грн\n`, "")}
	//
	// <b>Гости:</b>
	//
	// ${users.reduce((_text, { user }) => `${_text}${user.name}\n`, "")}
	// `;
	//
	// 			for (const { user } of users) {
	// 				await this._bot.telegram.sendMessage(user.telegramId, text, { parse_mode: "HTML" });
	// 			}
	//
	// 			return "done";
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
}
