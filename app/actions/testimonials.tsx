"use server"

import Good from "@/models/Good"
import Testimonial from "@/models/Testimonial"

import { ISearchParams, ITestimonial } from "@/types/index"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface IGetAllTestimonials {
  success: boolean
  testimonials: ITestimonial[]
  count: number
}

export async function addTestimonial(values: ITestimonial) {
  console.log("values", values)

  if (!values.name) {
    throw new Error("Name is required.")
  }

  if (!values.text && typeof values.text !== "string") {
    throw new Error("Text is required and must be a string")
  }

  // Remove the check for rating and handle it being optional
  if (values.isActive === undefined) {
    throw new Error("isActive field is required.")
  }

  try {
    await connectToDB()

    const existingTestimonial = await Testimonial.findOne({
      name: values.name,
      text: values.text
    })

    if (existingTestimonial) {
      throw new Error("This testimonial already exists")
    }

    // const testimonialData: Partial<ITestimonial> = {
    //   name: values.name,
    //   text: values.text,
    //   isActive: values.isActive,
    //   product: values.product
    // }

    const newTestimonial = await Testimonial.create(values)

    // 2. Отримуємо всі активні відгуки по товару (включаючи щойно створений)
    const testimonials = await Testimonial.find({
      product: values.product,
      isActive: true,
      rating: { $gt: 0 }
    })

    const ratingSum = testimonials.reduce((acc, t) => acc + t.rating, 0)
    const ratingCount = testimonials.length
    const averageRating = ratingCount ? ratingSum / ratingCount : null

    // 3. Оновлюємо товар з новим рейтингом
    const updatedGood = await Good.findByIdAndUpdate(
      values.product,
      {
        averageRating,
        ratingCount
      },
      { new: true } // <-- поверне оновлений документ
    )

    if (!updatedGood) {
      throw new Error("Product not found")
    }

    // 4. Повертаємо оновлений товар
    return {
      updatedGood: JSON.parse(JSON.stringify(updatedGood)),
      success: true,
      message: "Testimonial added successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding Testimonial:", error)
      throw new Error("Failed to add Testimonial: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to add Testimonial: Unknown error")
    }
  } finally {
    revalidatePath("/admin/testimonials")
  }
}

export async function getAllTestimonials(
  searchParams: ISearchParams
): Promise<IGetAllTestimonials> {
  const limit = searchParams.limit || 4
  const page = searchParams.page || 1

  try {
    await connectToDB()

    const count = await Testimonial.countDocuments()

    const testimonials: ITestimonial[] = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .exec()

    return {
      success: true,
      testimonials: JSON.parse(JSON.stringify(testimonials)),
      count: count
    }
  } catch (error) {
    console.log(error)
    return { success: false, testimonials: [], count: 0 }
  }
}

export async function getTestimonialById(id: string) {
  try {
    await connectToDB()
    const testimonial = await Testimonial.findById({ _id: id })
    return JSON.parse(JSON.stringify(testimonial))
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting testimonials:", error)
      throw new Error("Failed to get testimonials: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to get testimonials: Unknown error")
    }
  }
}

export async function deleteTestimonial(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    await Testimonial.findByIdAndDelete(id)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error delete category:", error)
      throw new Error("Failed to delete category: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to delete category: Unknown error")
    }
  } finally {
    revalidatePath("/admin/testimonials")
  }
}

export async function updateTestimonial(values: any) {
  try {
    await connectToDB()

    const updateFields = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => key !== "_id" && value !== undefined)
    )

    if (Object.keys(updateFields).length === 0) {
      return {
        success: false,
        message: "No valid fields to update."
      }
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      values._id,
      { $set: updateFields },
      { new: true }
    )

    if (!updatedTestimonial) {
      return {
        success: false,
        message: "Testimonial not found."
      }
    }

    return {
      success: true,
      message: "Testimonial updated successfully"
    }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }
  } finally {
    revalidatePath("/admin/testimonials")
    redirect("/admin/testimonials")
  }
}

export async function getTestimonialsByGoods() {
  try {
    await connectToDB()
    const testimonials = await Testimonial.find({ isActive: true }).populate("product")
    console.log("testimonials:", testimonials)
    return testimonials
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }
  } finally {
  }
}
