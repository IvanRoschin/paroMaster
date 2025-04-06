"use server"

import Testimonials from "@/models/Testimonials"
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
  if (!values.name || !values.text || !values.rating || !values.isActive) {
    throw new Error("All fields are required")
  }
  try {
    await connectToDB()
    const existingTestimonial = await Testimonials.findOne({
      name: values.name,
      text: values.text
    })

    if (existingTestimonial) {
      throw new Error("This testimonial already exists")
    }

    await Testimonials.create({
      name: values.name,
      text: values.text,
      rating: Number(values.rating),
      isActive: values.isActive
    })
    return {
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

    const count = await Testimonials.countDocuments()

    const testimonials: ITestimonial[] = await Testimonials.find()
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
    const category = await Testimonials.findById({ _id: id })
    return JSON.parse(JSON.stringify(category))
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
    await Testimonials.findByIdAndDelete(id)
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

    const updatedTestimonial = await Testimonials.findByIdAndUpdate(
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
