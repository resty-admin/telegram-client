import { Module } from "@nestjs/common";

import { ApiModule } from "../shared/api";
import { ORDERS_UPDATES } from "./updates";

@Module({
	imports: [ApiModule.forChild()],
	providers: ORDERS_UPDATES
})
export class OrdersModule {}
