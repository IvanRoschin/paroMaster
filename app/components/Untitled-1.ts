		// // Initialize the filter object
		// let filter: any = {}

		// // Handle search filter
		// if (searchParams?.search) {
		// 	filter.$and = [
		// 		{
		// 			$or: [
		// 				{ title: { $regex: searchParams.search, $options: 'i' } },
		// 				{ vendor: searchParams.search },
		// 				{ brand: { $regex: searchParams.search, $options: 'i' } },
		// 				{ compatibility: { $regex: searchParams.search, $options: 'i' } },
		// 			],
		// 		},
		// 	]
		// }

		// // Handle brand filter
		// if (searchParams?.brand) {
		// 	filter.brand = searchParams.brand
		// }

		// // Handle category filter
		// let categoryFilter: any = {}
		// if (searchParams?.category) {
		// 	categoryFilter = { category: searchParams.category }
		// }

		// // Handle price filter with aggregation
		// let priceFilter: any = {}
		// if (searchParams?.low && searchParams?.high) {
		// 	const lowPrice = Number(searchParams.low)
		// 	const highPrice = Number(searchParams.high)

		// 	if (!isNaN(lowPrice) && !isNaN(highPrice)) {
		// 		priceFilter = {
		// 			$expr: {
		// 				$and: [
		// 					{ $gte: [{ $toDouble: '$price' }, lowPrice] },
		// 					{ $lte: [{ $toDouble: '$price' }, highPrice] },
		// 				],
		// 			},
		// 		}
		// 	}
		// }

		// // Combine category and price filters
		// filter = {
		// 	$and: [categoryFilter, priceFilter, ...(filter.$and || [])],
		// }
