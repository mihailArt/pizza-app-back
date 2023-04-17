import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma.service'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async getUserById(id) {
		return this.prisma.user.findUnique({
			where: {
				id: +id
			}
		})
	}

	async addToBasket(data) {
		return this.prisma.user.update({
			where: {
				id: +data.userId
			},
			data: {
				basketId: +data.basketId
			}
		})
	}

	async login(userDto: UserDto) {
		const user = await this.validateUser(userDto)
		const tokens = await this.createTokens(user.id)

		return {
			user: {
				id: user.id,
				email: user.email,
				phone: user.phone,
				name: user.name,
				basketId: user.basketId
			},
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id
			}
		})

		const tokens = await this.createTokens(user.id)

		return {
			user: {
				id: user.id,
				email: user.email
			},
			...tokens
		}
	}

	async register(userData: UserDto) {
		const { name, email, password, phone } = userData
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email
			}
		})

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				email,
				name,
				phone,
				password: await hash(password)
			}
		})

		const tokens = await this.createTokens(user.id)
		return {
			user: {
				id: user.id,
				email: user.email
			},
			...tokens
		}
	}

	private async createTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '15m'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '2h'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(userDto: UserDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: userDto.email
			}
		})

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, userDto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
}
