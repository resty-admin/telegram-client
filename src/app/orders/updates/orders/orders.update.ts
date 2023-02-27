import * as dayjs from "dayjs";
import { InjectBot, Update } from "nestjs-telegraf";
import { OrdersEvents } from "src/app/shared/constants";
import { OnSocketEvent } from "src/app/shared/socket-io";
import { environment } from "src/environments/environment";
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

export const DAYJS_DISPLAY_FORMAT = "DD MMMM, HH:mm";

@Update()
export class OrdersUpdate {
	constructor(@InjectBot() private readonly _bot: Telegraf) {}

	async replyWithOrder(orderEvent: any, customTemplate: string = "") {
		console.log(orderEvent);

		const { id, code, table, type, place, startDate, pTos, users, employees } = orderEvent;

		if (users.length === 0) {
			return;
		}

		const messages = [`<b>Заклад:</b> ${place.name}`, `<b>Заказ:</b> ${code} з типом <b>${typesText[type]}</b>`];

		if (table) {
			messages.push(`<b>Стіл:</b> ${table.name}`);
		}

		if (startDate) {
			messages.push(`<b>Дата:</b> ${dayjs(startDate).format(DAYJS_DISPLAY_FORMAT)}`);
		}

		if ((employees || []).length > 0) {
			messages.push(`<b>Офіціанти:</b> ${employees.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.name, "")}`);
		}

		if ((pTos || []).length > 0) {
			messages.push(`<b>Страви:</b> ${pTos.reduce((pre, curr) => pre + (pre ? ", " : "") + curr.product.name, "")}`);
		}

		if (customTemplate) {
			messages.push("---", customTemplate);
		}

		for (const user of users.filter((user) => user.telegramId)) {
			try {
				await this._bot.telegram.sendMessage(user.telegramId, messages.join("\n"), {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "Перейти",
									web_app: {
										url: `${environment.appUrl}/active-orders/${id}`
									}
								}
							]
						]
					}
				});
			} catch (error) {
				console.error(error);
			}
		}
	}

	@OnSocketEvent(OrdersEvents.CANCELED)
	async orderClosedNotifyUser(orderEvent: IOrderEvent) {
		this.replyWithOrder(orderEvent, "Скасовано");
	}

	@OnSocketEvent(OrdersEvents.APPROVED)
	async orderApproveNotify(orderEvent: IOrderEvent) {
		this.replyWithOrder(orderEvent, "Підтверждено");
	}

	@OnSocketEvent(OrdersEvents.MANUAL_PAYMENT_SUCCESS)
	async orderManualPaymentSuccessNotify(orderEvent: IOrderEvent) {
		if (orderEvent.order.users.length === 0) {
			return;
		}

		const { code, table, type } = orderEvent.order;

		const text = `
Замовлення <b>${code}</b> ${table ? `за столом: ${table.name || table.code}` : ""} з типом <b>${typesText[type]}</b>.
Оплату підтверджено. 
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
		this.replyWithOrder(orderEvent, "Відхилено");
	}

	@OnSocketEvent(OrdersEvents.PTO_REJECTED)
	async orderRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		this.replyWithOrder(orderEvent, "Відхилені офіціантом");
	}

	@OnSocketEvent(OrdersEvents.PTO_APPROVED)
	async orderApprovedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		this.replyWithOrder(orderEvent, "Підтверджені офіціантом");
	}

	@OnSocketEvent(OrdersEvents.TABLE_APPROVED)
	async orderTableApprovedNotifyWaiter(orderEvent: IOrderEvent) {
		this.replyWithOrder(orderEvent, "Стіл підтверджено офіціантом");
	}

	@OnSocketEvent(OrdersEvents.TABLE_REJECTED)
	async orderTableRejectedNotifyWaiter(orderEvent: IOrderPtosEvent) {
		this.replyWithOrder(orderEvent, "Стіл відхилено офіціантом");
	}

	@OnSocketEvent(OrdersEvents.MANUAL_PAYMENT_SUCCESS)
	async manualPaymentSuccess(orderEvent: IOrderPtosEvent) {
		this.replyWithOrder(orderEvent, "Ручна оплата підтверджена");
	}
}
