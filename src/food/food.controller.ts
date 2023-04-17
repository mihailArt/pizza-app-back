import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { FoodService } from './food.service'
import { Food as FoodModel } from '@prisma/client'
import { CreateFoodDto } from './dto/create-food.dto'

@Controller('food')
export class FoodController {
	constructor(private readonly foodService: FoodService) {}

	@Get('/category')
	findAllCategoriesWithFood() {
		return this.foodService.getCategoriesWithFood()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<FoodModel> {
		return this.foodService.findOne({ id: Number(id) })
	}

	@Get()
	findAll() {
		return this.foodService.findAll({})
	}

	@Post()
	create(@Body() foodData: CreateFoodDto): Promise<FoodModel> {
		const {
			name,
			cost,
			weight,
			ingredients,
			kcal,
			protein,
			fat,
			carbohydrate,
			categoryId
		} = foodData
		return this.foodService.create({
			name,
			cost,
			weight,
			ingredients,
			kcal,
			protein,
			fat,
			carbohydrate,
			category: {
				connect: { id: categoryId }
			}
		})
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
	//   return this.foodService.update(+id, updateFoodDto);
	// }

	@Delete(':id')
	remove(@Param('id') id: string): Promise<FoodModel> {
		return this.foodService.remove({ id: Number(id) })
	}
}
