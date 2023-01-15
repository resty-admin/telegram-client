import type { IUser } from "../users";
import type { IOrder } from "./order.interface";


export interface IOrderEvent {
	order: IOrder;
}

export interface IOrderPtosEvent extends IOrderEvent {
	pTos: any[];
}

// export interface IOrderCancelEvent extends IOrderEvent {
// 	users: IUser;
// }
