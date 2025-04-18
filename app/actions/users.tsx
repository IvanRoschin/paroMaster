"use server"

import User from "@/models/User"
import { ISearchParams } from "@/types/index"
import { IUser } from "@/types/user/IUser"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addUser(formData: FormData): Promise<void> {
  try {
    await connectToDB()
    // Check if email already exists
    const email = formData.get("email") as string

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("Email already exists")
    }

    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const isAdmin = formData.get("isAdmin") === "true"
    const isActive = formData.get("isActive") === "true"
    const password = formData.get("password") as string

    const newUser = new User({
      name,
      phone,
      email,
      isAdmin,
      isActive
    })

    newUser.setPassword(password)

    await newUser.save()
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

export async function getAllUsers(searchParams: ISearchParams) {
  const limit = searchParams.limit || 10
  const q = searchParams.q || ""
  const page = searchParams.page || 1
  const ITEM_PER_PAGE = limit
  const regex = new RegExp(q, "i")
  try {
    await connectToDB()
    const count = await User.find({ name: { $regex: regex } }).countDocuments()
    const users: IUser[] = await User.find({ name: { $regex: regex } })
      .sort({ createdAt: -1 })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
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

export async function updateUser(values: any) {
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
      message: "Користувача оновлено успішно "
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error update user:", error)
      throw new Error("Failed to update user: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to update user: Unknown error")
    }
  } finally {
    revalidatePath("/admin/users")
    redirect("/admin/users")
  }
}
