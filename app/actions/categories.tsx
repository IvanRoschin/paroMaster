"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { buildPagination } from "@/helpers/index"
import Category from "@/models/Category"
import { ICategory, ISearchParams } from "@/types/index"
import { connectToDB } from "@/utils/dbConnect"

export interface IGetAllCategories {
  success: boolean
  categories: ICategory[]
  count: number
}

export async function addCategory(formData: FormData) {
  const values: Record<string, any> = {}

  formData.forEach((value, key) => {
    if (!values[key]) {
      values[key] = []
    }
    values[key].push(value)
  })

  Object.keys(values).forEach(key => {
    if (values[key].length === 1) {
      values[key] = values[key][0]
    }
  })
  try {
    await connectToDB()
    const title = values.title
    const existingCategory = await Category.findOne({ title })
    if (existingCategory) {
      throw new Error("Category already exists")
    }
    await Category.create(values)
    return {
      success: true,
      message: " Category added successfully"
    }
  } catch (error) {
    console.error("Error adding Category:", error)
    return {
      success: false,
      message: "Error adding Category"
    }
  } finally {
    revalidatePath("/admin/categories")
    redirect("/admin/categories")
  }
}

export async function getAllCategories(searchParams: ISearchParams): Promise<IGetAllCategories> {
  const currentPage = Number(searchParams.page) || 1
  const { skip, limit } = buildPagination(searchParams, currentPage)

  try {
    await connectToDB()

    const count = await Category.countDocuments()

    const categories: ICategory[] = await Category.find().skip(skip).limit(limit).exec()

    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
      count: count
    }
  } catch (error) {
    console.log(error)
    return { success: false, categories: [], count: 0 }
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectToDB()
    const category = await Category.findById({ _id: id })
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting categories:", error)
      throw new Error("Failed to get categories: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to get categories: Unknown error")
    }
  }
}

export async function deleteCategory(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    await Category.findByIdAndDelete(id)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error delete category:", error)
      throw new Error("Failed to delete category: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to delete category: Unknown error")
    }
  } finally {
    revalidatePath("/admin/categories")
  }
}

export async function updateCategory(formData: FormData) {
  const entries = Object.fromEntries(formData.entries())
  const { id, title, src } = entries as {
    id: string
    title?: string
    src?: string
  }
  try {
    await connectToDB()
    const updateFields: Partial<ICategory> = {
      title,
      src
    }
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof ICategory] === "" ||
          updateFields[key as keyof ICategory] === undefined) &&
        delete updateFields[key as keyof ICategory]
    )
    await Category.findByIdAndUpdate(id, updateFields)
    return {
      success: true,
      message: "Category updated successfully"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error update category:", error)
      throw new Error("Failed to category user: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to update category: Unknown error")
    }
  } finally {
    revalidatePath("/admin/categories")
  }
}
