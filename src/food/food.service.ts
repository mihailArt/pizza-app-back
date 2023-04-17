import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Food, Prisma } from '@prisma/client'
import { CategoriesWithFood } from './interfaces'

@Injectable()
export class FoodService {
	constructor(private prisma: PrismaService) {}

	async findOne(
		foodWhereUniqueInput: Prisma.FoodWhereUniqueInput
	): Promise<Food | null> {
		return this.prisma.food.findUnique({
			where: foodWhereUniqueInput,
			include: {
				category: true
			}
		})
	}

	async findAll(params: {
		skip?: number
		take?: number
		cursor?: Prisma.FoodWhereUniqueInput
		where?: Prisma.FoodWhereInput
		orderBy?: Prisma.FoodOrderByWithRelationInput
	}): Promise<Food[]> {
		const { skip, take, cursor, where, orderBy } = params
		return this.prisma.food.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include: {
				category: true
			}
		})
	}

	async create(data: Prisma.FoodCreateInput): Promise<Food> {
		return this.prisma.food.create({
			data
		})
	}

	async update(params: {
		where: Prisma.FoodWhereUniqueInput
		data: Prisma.FoodUpdateInput
	}): Promise<Food> {
		const { where, data } = params
		return this.prisma.food.update({
			data,
			where
		})
	}

	async remove(where: Prisma.FoodWhereUniqueInput): Promise<Food> {
		return this.prisma.food.delete({
			where
		})
	}

	async getCategoriesWithFood(): Promise<CategoriesWithFood[]> {
		const categories = await this.prisma.category.findMany({
			include: {
				foods: true
			}
		})

		return categories.map(elem => {
			const products = elem.foods.map(elem => {
				return {
					name: elem.name,
					weight: elem.weight,
					cost: elem.cost,
					ingredientsList: elem.ingredients,
					nutritionalInformation: {
						kcal: elem.kcal,
						Protein: elem.protein,
						Fat: elem.fat,
						Carbohydrate: elem.carbohydrate
					}
				}
			})
			return {
				categoryName: elem.name,
				products
			}
		})
	}
}
