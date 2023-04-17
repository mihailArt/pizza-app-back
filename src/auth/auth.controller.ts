import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserDto } from './dto/user.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() userDto: UserDto) {
		return this.authService.login(userDto)
	}

	@Post('login/access-token')
	async getNewTokens(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.getNewTokens(refreshTokenDto.refreshToken)
	}

	@Post('register')
	async register(@Body() userDto: UserDto) {
		return this.authService.register(userDto)
	}

	//todo: extract to separated service
	@Post('add-basket')
	async addBasket(@Body() data: { userId: number; basketId: number }) {
		return this.authService.addToBasket(data)
	}

	//todo: extract to separated service
	@Get('user/:id')
	async getUserById(@Param('id') id: string) {
		return this.authService.getUserById(id)
	}
}
