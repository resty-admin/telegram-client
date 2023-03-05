import type { Context } from "telegraf";

export type IContext = Context & { startPayload: string };

export interface IStateContext<State extends Record<string | symbol, any> = {}> extends IContext {
	state: State;
}

export interface ISessionContext<Session extends Record<string | symbol, any> = {}> extends IContext {
	session: Session;
}
