"use server"

import Good from "@/models/Good"
import Testimonial from "@/models/Testimonial"
import { IGood } from "@/types/good/IGood"
import { ISearchParams } from "@/types/index"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"

export interface IGetAllGoods {
  success: boolean
  goods: IGood[]
  count: number
}

export interface IGetAllBrands {
  success: boolean
  brands: string[]
}

export interface IGetPrices {
  success: boolean
  minPrice: number
  maxPrice: number
}
export async function getAllGoods(
  searchParams: ISearchParams,
  nextPage?: number
): Promise<IGetAllGoods> {
  const limit = searchParams?.limit || 10
  let skip: number

  if (nextPage) {
    skip = (nextPage - 1) * limit
  } else {
    const page = searchParams?.page || 1
    skip = (page - 1) * limit
  }

  try {
    await connectToDB()
    let filter: any = {}

    if (searchParams?.search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: searchParams.search, $options: "i" } },
            { vendor: searchParams.search },
            { brand: { $regex: searchParams.search, $options: "i" } },
            { model: { $regex: searchParams.search, $options: "i" } },
            { compatibility: { $regex: searchParams.search, $options: "i" } }
          ]
        }
      ]
    }

    let priceFilter: any = {}
    if (searchParams?.low && searchParams?.high) {
      const lowPrice = Number(searchParams.low)
      const highPrice = Number(searchParams.high)

      if (!isNaN(lowPrice) && !isNaN(highPrice)) {
        priceFilter = {
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$price" }, lowPrice] },
              { $lte: [{ $toDouble: "$price" }, highPrice] }
            ]
          }
        }
      }
    }

    filter = {
      $and: [priceFilter, ...(filter.$and || [])]
    }

    if (searchParams?.brand) {
      filter.brand = searchParams.brand
    }

    if (searchParams?.category) {
      filter.category = searchParams.category
    }

    // Handle sort by price
    let sortOption: any = {}
    if (searchParams?.sort === "desc") {
      sortOption = { price: -1 }
    } else {
      sortOption = { price: 1 }
    }

    // Query the count of documents matching the filter
    const count = await Good.countDocuments(filter)

    // Query the actual documents with pagination
    const goods: IGood[] = await Good.find(filter).sort(sortOption).skip(skip).limit(limit).exec()
    return {
      success: true,
      goods: JSON.parse(JSON.stringify(goods)),
      count: count
    }
  } catch (error) {
    console.log("Error fetching goods:", error)
    return { success: false, goods: [], count: 0 }
  }
}

export async function getGoodById(id: string) {
  try {
    await connectToDB()
    const good = await Good.findById({ _id: id })
    if (!good) return null

    const testimonials = await Testimonial.find({
      product: id,
      isActive: true
    }).sort({ createdAt: -1 })

    const compatibleGoods = await Good.find({
      isCompatible: true,
      compatibility: { $regex: good.model, $options: "i" }
    })
    return JSON.parse(
      JSON.stringify({
        ...good.toObject(),
        testimonials,
        compatibleGoods
      })
    )
  } catch (error) {
    console.log(error)
  }
}

export async function addGood(formData: FormData) {
  const values: Record<string, any> = {}

  // Convert FormData to an object
  formData.forEach((value, key) => {
    if (!values[key]) {
      values[key] = []
    }
    values[key].push(value)
  })

  // If an array has only one item, convert it to a single value
  Object.keys(values).forEach(key => {
    if (values[key].length === 1) {
      values[key] = values[key][0]
    }
  })

  // Ensure price is a number
  const price = Number(values.price)
  if (isNaN(price)) {
    console.error("Price must be a valid number")
    return {
      success: false,
      message: "Invalid price"
    }
  }
  values.price = price

  // Validate required fields
  if (
    !values.category ||
    !values.title ||
    !values.brand ||
    !values.model ||
    !values.vendor ||
    !values.price ||
    !values.description ||
    !values.src
  ) {
    console.error("Missing required fields")
    return {
      success: false,
      message: "Missing required fields"
    }
  }

  try {
    await connectToDB()

    const existingGood = await Good.findOne({ vendor: values.vendor })
    if (existingGood) {
      return {
        success: false,
        message: "Good with this vendor already exists"
      }
    }

    await Good.create({
      category: values.category,
      title: values.title,
      brand: values.brand.charAt(0).toUpperCase() + values.brand.slice(1).toLowerCase(),
      model: values.model,
      price: Number(values.price),
      description: values.description,
      src: Array.isArray(values.src) ? values.src : [values.src],
      vendor: values.vendor,
      isCondition: values.isAvailable === "true",
      isAvailable: values.isAvailable === "true",
      isCompatible: values.isCompatible === "true",
      compatibility: values.compatibility
    })

    return {
      success: true,
      message: "Good added successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding good:", error)
      return {
        success: false,
        message: error.message || "Error adding good"
      }
    }
  }
}

export async function deleteGood(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    const deletedReviews = await Testimonial.deleteMany({ product: id })

    if (deletedReviews.deletedCount > 0) {
      console.log(`Видалено ${deletedReviews.deletedCount} відгуків для товару з ID: ${id}`)
    } else {
      console.log("Відгуків не було знайдено для видалення")
    }
    await Good.findByIdAndDelete(id)
  } catch (error) {
    console.error("Failed to delete the good:", error)
  }
}

export async function updateGood(formData: FormData) {
  const values: any = {}
  formData.forEach((value, key) => {
    if (!values[key]) values[key] = []
    values[key].push(value)
  })

  Object.keys(values).forEach(key => {
    if (values[key].length === 1) values[key] = values[key][0]
  })

  const {
    id,
    category,
    src,
    brand,
    model,
    vendor,
    title,
    description,
    price,
    isCondition,
    isAvailable,
    isCompatible,
    compatibility
  } = values as {
    id: string
    category?: string
    src?: any
    brand?: string
    model?: string
    vendor?: string
    title?: string
    description?: string
    price?: number
    isCondition?: string
    isAvailable?: string
    isCompatible?: string
    compatibility?: any
  }

  try {
    await connectToDB()

    const updateFields: Partial<IGood> = {
      category,
      src,
      brand,
      model,
      vendor,
      title,
      description,
      price: Number(price),
      isCondition: isCondition === "true",
      isAvailable: isAvailable === "true",
      isCompatible: isCompatible === "true",
      compatibility
    }

    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof IGood] === "" ||
          updateFields[key as keyof IGood] === undefined) &&
        delete updateFields[key as keyof IGood]
    )

    await Good.findByIdAndUpdate(id, updateFields)

    return {
      success: true,
      message: "Good updated successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating good:", error)
      return {
        success: false,
        message: error.message || "Error updating good"
      }
    }
    return {
      success: false,
      message: "Unknown error occurred"
    }
  }
}

export async function uniqueBrands(): Promise<IGetAllBrands> {
  try {
    connectToDB()
    const uniqueBrands = await Good.distinct("brand")
    return {
      success: true,
      brands: uniqueBrands
    }
  } catch (error) {
    console.log(error)
    return { success: false, brands: [] }
  } finally {
    revalidatePath("/")
  }
}

export async function getMostPopularGoods() {
  try {
    await connectToDB()
    const mostPopularGoods: IGood[] = await Good.find()
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(10)

    return {
      success: true,
      goods: JSON.parse(JSON.stringify(mostPopularGoods))
    }
  } catch (error) {
    console.log("Error fetching most popular goods:", error)
    return { success: false, goods: [] }
  } finally {
    revalidatePath("/")
  }
}

export async function getMinMaxPrice(): Promise<{
  success: boolean
  minPrice: number | null
  maxPrice: number | null
  message?: string
}> {
  try {
    // Connect to the database
    await connectToDB()

    // Perform the aggregation
    const result = await Good.aggregate([
      {
        $project: {
          price: {
            $cond: {
              if: { $isNumber: { $toDouble: "$price" } },
              then: { $toDouble: "$price" },
              else: null
            }
          }
        }
      },
      {
        $match: {
          price: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          minPrice: 1,
          maxPrice: 1
        }
      }
    ]).exec()

    // Check if results were found
    if (result.length === 0) {
      return { success: false, minPrice: null, maxPrice: null, message: "No valid goods found" }
    }

    return {
      success: true,
      minPrice: result[0].minPrice,
      maxPrice: result[0].maxPrice
    }
  } catch (error: any) {
    console.error("Error fetching min and max prices:", error)
    return { success: false, minPrice: null, maxPrice: null, message: error.message }
  }
}
