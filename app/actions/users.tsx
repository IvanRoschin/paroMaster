"use server"

import User from "@/models/User"
import { ISearchParams } from "@/types/index"
import { IUser } from "@/types/user/IUser"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { buildFilter, buildPagination, buildSort } from "../helpers"

export async function addUser(values: any): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()
    // Check if email already exists
    const email = values.email as string

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("Email already exists")
    }

    const name = values.name as string
    const phone = values.phone as string
    const isAdmin = values.isAdmin
    const isActive = values.isActive
    const password = values.password as string

    const newUser = new User({
      name,
      phone,
      email,
      isAdmin,
      isActive
    })

    newUser.setPassword(password)

    await newUser.save()
    return {
      success: true,
      message: "Користувача додано успішно!"
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding newUser:", error)
      throw new Error("Failed to add newUser: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to add newUser: Unknown error")
    }
  } finally {
    revalidatePath("/admin/users")
    redirect("/admin/users")
  }
}

export async function getAllUsers(searchParams: ISearchParams, currentPage = 1) {
  const { skip, limit } = buildPagination(searchParams, currentPage)
  const filter = buildFilter(searchParams)
  const sortOption = buildSort(searchParams)

  try {
    await connectToDB()
    const count = await User.countDocuments()

    const users: IUser[] = await User.find(filter).sort(sortOption).limit(limit).skip(skip)
    return { success: true, users: JSON.parse(JSON.stringify(users)), count: count }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting users:", error)
      throw new Error("Failed to get users: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to get users: Unknown error")
    }
  }
}

export async function getUserById(id: string) {
  try {
    await connectToDB()
    const user = await User.findById({ _id: id })
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.log(error)
  }
}

export async function deleteUser(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    await User.findByIdAndDelete(id)
  } catch (error) {
    console.log(error)
  }
  revalidatePath("/admin/users")
}

export async function updateUser(values: any): Promise<{ success: boolean; message: string }> {
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

    const updatedUser = await User.findByIdAndUpdate(
      values._id,
      { $set: updateFields },
      { new: true }
    )

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found."
      }
    }

    return {
      success: true,
      message: "Користувача оновлено успішно"
    }
  } catch (error) {
    console.error("Error update user:", error)
    throw new Error("Failed to update user")
  } finally {
    revalidatePath("/admin/users")
    redirect("/admin/users")
  }
}
