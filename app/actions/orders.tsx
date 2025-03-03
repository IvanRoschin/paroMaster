"use server"

import Order from "@/models/Order"
import { ISearchParams } from "@/types/index"
import { IOrder } from "@/types/order/IOrder"
import { connectToDB } from "@/utils/dbConnect"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface IGetAllOrdesResponse {
  success: boolean
  orders: IOrder[]
  count: number
}
export async function getAllOrders(
  searchParams: ISearchParams,
  limit: number
): Promise<IGetAllOrdesResponse> {
  const page = searchParams.page || 1
  const status = searchParams.status === null ? "all" : searchParams.status

  try {
    await connectToDB()

    let query = {}
    if (status !== "all") {
      query = { status }
    }

    const count = await Order.countDocuments()

    const orders: IOrder[] = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .exec()

    return { success: true, orders: JSON.parse(JSON.stringify(orders)), count }
  } catch (error) {
    console.log(error)
    return { success: false, orders: [], count: 0 }
  }
}

export async function addOrder(values: IOrder) {
  // console.log("valuesBackend:", values)
  try {
    await connectToDB()

    const orderData = {
      number: values.number,
      customer: values.customer,
      orderedGoods: values.orderedGoods.map(item => ({
        title: item.title,
        brand: item.brand,
        model: item.model,
        vendor: item.vendor,
        price: item.price,
        quantity: item.quantity,
        src: item.src
      })),
      totalPrice: values.totalPrice,
      status: values.status
    }
    // console.log('orderData', orderData)

    await Order.create(orderData)
    revalidatePath("/")
    return { success: true, data: orderData }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding order:", error)
      throw new Error("Failed to add order: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to add order: Unknown error")
    }
  }
}

export const deleteGoodsFromOrder = async (orderId: string, goodsId: string) => {
  try {
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error("Order not found")
    }
    type OrderedGood = {
      id: string
      price: number
      quantity: number
    }

    const updatedGoods = order.orderedGoods.filter((good: OrderedGood) => good.id !== goodsId)

    order.orderedGoods = updatedGoods

    order.goodsQuantity = updatedGoods.reduce(
      (total: number, good: OrderedGood) => total + good.quantity,
      0
    )
    order.totalPrice = updatedGoods.reduce(
      (total: number, good: OrderedGood) => total + good.price * good.quantity,
      0
    )

    // Save the updated order
    await order.save()

    return { success: true, message: "Goods deleted successfully" }
  } catch (error) {
    console.error("Error deleting goods:", error)
    return { success: false, message: "Failed to delete goods" }
  }
}

export async function addOrderAction(values: IOrder) {
  try {
    await connectToDB()

    // const orderData = {
    // 	number: values.number,
    // 	customer: values.customer,
    // 	orderedGoods: values.orderedGoods,
    // 	totalPrice: values.totalPrice,
    // 	status: values.status || 'Новий',
    // }
    await Order.create(values)
    revalidatePath("/")
    return { success: true, message: "The New Order Successfully Added" }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding order:", error)
      return { success: false, message: "Failed to add order: " + error.message }

      // throw new Error('Failed to add order: ' + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to add order: Unknown error")
    }
  }
}

export async function deleteOrder(id: string) {
  if (!id) {
    console.error("No ID provided")
    return
  }
  try {
    await connectToDB()
    await Order.findByIdAndDelete(id)
  } catch (error) {
    console.error("Failed to delete the order:", error)
  } finally {
    revalidatePath("/admin/orders")
    redirect("/admin/orders")
  }
}

export async function getOrderById(id: string) {
  try {
    await connectToDB()
    const order = await Order.findById({ _id: id })
    return JSON.parse(JSON.stringify(order))
  } catch (error) {
    console.log(error)
  }
}

export async function updateOrder(values: IOrder) {
  const id = values._id

  const { number, customer, orderedGoods, totalPrice, status } = values

  try {
    await connectToDB()

    const updateFields: Partial<IOrder> = {
      number,
      customer: customer
        ? {
            name: customer.name || "",
            surname: customer.surname || "",
            phone: customer.phone || "",
            email: customer.email || "",
            city: customer.city || "",
            warehouse: customer.warehouse || "",
            payment: customer.payment || ""
          }
        : undefined,
      orderedGoods,
      totalPrice,
      status
    }

    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof IOrder] === "" ||
          updateFields[key as keyof IOrder] === undefined) &&
        delete updateFields[key as keyof IOrder]
    )

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true
    }).lean()

    if (!updatedOrder || Array.isArray(updatedOrder)) {
      throw new Error("Failed to update order: No document returned or multiple documents returned")
    }

    return { success: true, message: "Замовлення оновлено успішно" }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating order:", error)
      throw new Error("Failed to update order: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Failed to update order: Unknown error")
    }
  } finally {
    revalidatePath("/admin/orders")
    redirect("/admin/orders")
  }
}
