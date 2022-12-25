import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getBotToken } from "nestjs-telegraf";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	if (environment.production) {
		const bot = app.get(getBotToken());
		app.use(bot.webhookCallback(environment.hookPath));
	}

	await app.listen(environment.port);
}

bootstrap().then(() => {
	Logger.log(`🚀 Application is running on: http://localhost:${environment.port}`);
	Logger.log(`🚀 Telegram Bot Client is running`, "Bootstrap");
});
