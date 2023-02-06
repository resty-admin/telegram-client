import { Injectable } from "@nestjs/common";
import type { IAccessToken, ITelegramUser, IUser } from "src/app/shared";
import { ApiService } from "src/app/shared/api";
import { AUTH_ENDPOINTS } from "src/app/shared/constants";
import { JwtService } from "src/app/shared/jwt";

@Injectable()
export class AuthService {
	constructor(private readonly _apiService: ApiService, private readonly _jwtService: JwtService) {}

	async getUser(telegramUser: ITelegramUser) {
		try {
			const { accessToken } = await this._apiService.post<IAccessToken>(AUTH_ENDPOINTS.TELEGRAM, telegramUser);

			this._apiService.setJwt(accessToken);

			return this._jwtService.decode<IUser>(accessToken);
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
