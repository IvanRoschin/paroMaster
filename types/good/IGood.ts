export interface IGood {
	_id?: string
	category: string
	src: string[]
	brand: string
	model: string
	vendor: string
	title: string
	description: string
	price: number
	isAvailable: boolean
	isCompatible: boolean
	compatibility: string
}

export interface SGood {
	quantity: number
	id: string
	category: string
	src: string[]
	brand: string
	model: string
	vendor: string
	title: string
	description: string
	price: number
	isAvailable: boolean
	isCompatible: boolean
	compatibility: string[]
}
