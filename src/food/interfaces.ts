export interface CategoriesWithFood {
	categoryName: string
	products: Product[]
}

export interface NutritionalInformation {
	kcal: number
	Protein: number
	Fat: number
	Carbohydrate: number
}

export interface Product {
	name: string
	weight: number
	cost: number
	ingredientsList: string
	nutritionalInformation: NutritionalInformation
}
