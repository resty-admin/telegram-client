import { InjectBot, Update } from "nestjs-telegraf";
import { OrdersEvents } from "src/app/shared/constants";
import { OnSocketEvent } from "src/app/shared/socket-io";
import { Telegraf } from "telegraf";

import { IOrderEvent, IOrderPtosEvent } from "../../../shared/interfaces/orders/order-created.interface";

export enum OrderTypeEnum {
	"RESERVE" = "RESERVE",
	"PICKUP" = "PICKUP",
	"IN_PLACE" = "IN_PLACE",
	"DELIVERY" = "DELIVERY"
}

const typesText = {
	[OrderTypeEnum.RESERVE]: "Бронювання",
	[OrderTypeEnum.PICKUP]: "З собою",
	[OrderTypeEnum.IN_PLACE]: "У закладі",
	[OrderTypeEnum.DELIVERY]: "Доставка"
};

@Update()
export class OrdersUpdate {
	constructor(@InjectBot() private readonly _bot: Telegraf) {}

	@OnSocketEvent(OrdersEvents.CLOSED)
	async orderClosedNotifyWaiter(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${
			typesText[type]
		}</b> скасовано. 
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
	async orderApproveNotify(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${
			typesText[type]
		}</b> підтверждено. 
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
	async orderRejectNotify(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${
			typesText[type]
		}</b> скасовано. 
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

	@OnSocketEvent(OrdersEvents.PTO_REJECTED)
	async orderRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${typesText[type]}</b>.
Страви: ${
			orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name, '')
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

	@OnSocketEvent(OrdersEvents.PTO_APPROVED)
	async orderApprovedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${typesText[type]}</b>.
Страви: ${
			orderEvent.pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name, '')
		} підтверджені офіціантом.
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

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${typesText[type]}</b>.
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

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${typesText[type]}</b>.
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
