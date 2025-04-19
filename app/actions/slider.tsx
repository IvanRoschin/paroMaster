"use server"

import Slider from "@/models/Slider"
import { ISlider } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface IGetAllSlides {
  success: boolean
  slides: ISlider[]
  count: number
}

export async function addSlide(formData: FormData) {
  const values = Object.fromEntries(formData.entries())
  try {
    await connectToDB()

    await Slider.create(values)
    return {
      success: true,
      message: "Slide added successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding Slide:", error)
      throw new Error("Failed to add Slide: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to add category: Unknown error")
    }
  } finally {
    revalidatePath("/admin/slider")
  }
}

export async function getAllSlides(searchParams: ISearchParams): Promise<IGetAllSlides> {
  const limit = searchParams?.limit || 3

  const page = searchParams.page || 1

  try {
    await connectToDB()

    const count = await Slider.countDocuments()

    const slides: ISlider[] = await Slider.find()
      .skip(limit * (page - 1))
      .limit(limit)
      .exec()

    return {
      success: true,
      slides: JSON.parse(JSON.stringify(slides)),
      count: count
    }
  } catch (error) {
    console.log(error)
    return { success: false, slides: [], count: 0 }
  }
}

export async function getSlideById(id: string) {
  try {
    await connectToDB()
    const category = await Slider.findById({ _id: id })
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting Slide:", error)
      throw new Error("Failed to get categories: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to get categories: Unknown error")
    }
  }
}

export async function deleteSlide(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    await Slider.findByIdAndDelete(id)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error delete Slide:", error)
      throw new Error("Failed to delete Slide: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to delete category: Unknown error")
    }
  } finally {
    revalidatePath("/admin/slider")
  }
}

export async function updateSlide(formData: FormData) {
  const entries = Object.fromEntries(formData.entries())
  const { id, title, desc, src } = entries as {
    id: string
    title?: string
    desc?: string
    src?: string
  }
  try {
    await connectToDB()
    const updateFields: Partial<ISlider> = {
      title,
      src,
      desc
    }
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof ISlider] === "" ||
          updateFields[key as keyof ISlider] === undefined) &&
        delete updateFields[key as keyof ISlider]
    )
    await Slider.findByIdAndUpdate(id, updateFields)
    return {
      success: true,
      message: "Slide updated successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error update Slide:", error)
      throw new Error("Failed to update Slide: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to update Slide: Unknown error")
    }
  } finally {
    revalidatePath("/admin/slider")
    redirect("/admin/slider")
  }
}
