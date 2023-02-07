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

		const { orderNumber, table, type } = orderEvent.order;

		const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b> отменен. 
`;
		for (const user of orderEvent.order.users) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	@OnSocketEvent(OrdersEvents.REJECTED)
	async orderRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { orderNumber, table, type } = orderEvent.order;

		const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Страви: ${
			(orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name), "")
		} скасовані офіціантом.
`;
		for (const user of orderEvent.order.users) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	@OnSocketEvent(OrdersEvents.APPROVED)
	async orderApprovedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { orderNumber, table, type } = orderEvent.order;

		const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Страви: ${
			(orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name), "")
		}  підтверджені офіціантом.
`;
		for (const user of orderEvent.order.users) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	@OnSocketEvent(OrdersEvents.TABLE_APPROVED)
	async orderTableApprovedNotifyWaiter(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { orderNumber, table, type } = orderEvent.order;

		const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Бронювання столу підтверджено офіціантом.
`;
		for (const user of orderEvent.order.users) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	@OnSocketEvent(OrdersEvents.TABLE_REJECTED)
	async orderTableRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { orderNumber, table, type } = orderEvent.order;

		const text = `
Заказ <b>${orderNumber}</b> за столом: ${table.name || table.code} с типом <b>${type}</b>.
Бронювання столу скасовано офіціантом.
`;
		for (const user of orderEvent.order.users) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, text, {
					parse_mode: "HTML"
				});
			} catch (error) {
				console.error(error);
			}
		}
	}
}
