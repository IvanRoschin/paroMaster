'use server';
import { sendTelegramMessage } from 'app/lib/telegram';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { buildPagination, buildSort } from '@/helpers/index';
import Order from '@/models/Order';
import { IOrder, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

interface IGetAllOrdesResponse {
  success: boolean;
  orders: IOrder[];
  count: number;
}
export async function getAllOrders(
  searchParams: ISearchParams
): Promise<IGetAllOrdesResponse> {
  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);
  // const filter = buildFilter(searchParams)
  const sortOption = buildSort(searchParams);

  const status = searchParams.status;
  const filter: any = {};

  if (status && status !== 'all') {
    filter.status = status;
  }
  try {
    await connectToDB();

    const count = await Order.countDocuments();

    const orders: IOrder[] = await Order.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    return { success: true, orders: JSON.parse(JSON.stringify(orders)), count };
  } catch (error) {
    console.log(error);
    return { success: false, orders: [], count: 0 };
  }
}

export const deleteGoodsFromOrder = async (
  orderId: string,
  goodsId: string
) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }
    type OrderedGood = {
      id: string;
      price: number;
      quantity: number;
    };

    const updatedGoods = order.orderedGoods.filter(
      (good: OrderedGood) => good.id !== goodsId
    );

    order.orderedGoods = updatedGoods;

    order.goodsQuantity = updatedGoods.reduce(
      (total: number, good: OrderedGood) => total + good.quantity,
      0
    );
    order.totalPrice = updatedGoods.reduce(
      (total: number, good: OrderedGood) => total + good.price * good.quantity,
      0
    );

    // Save the updated order
    await order.save();

    return { success: true, message: 'Goods deleted successfully' };
  } catch (error) {
    console.error('Error deleting goods:', error);
    return { success: false, message: 'Failed to delete goods' };
  }
};

export async function addOrder(values: IOrder) {
  if (!values.number) {
    const generatedNumber = `ORD-${Date.now()}`;
    values.number = generatedNumber;
  }

  try {
    await connectToDB();
    console.log('Перед створенням замовлення');
    await Order.create(values);
    console.log('Замовлення створено');
    const msg = `✅ <b>Створено нове замовлення!</b>\n🧾 Замовлення: ${values.number} \n Від замовника ${values.customer.name}  ${values.customer.surname}\n💰 На суму: ${values.totalPrice}  \n Телефон замовника ${values.customer.phone}`;
    await sendTelegramMessage(msg);
    return {
      success: true,
      message: 'New Order created successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding order:', error);
      return {
        success: false,
        message: 'Failed to add order: ' + error.message,
      };
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to add order: Unknown error');
    }
  }
}

export async function deleteOrder(id: string): Promise<void> {
  if (!id) return;
  await connectToDB();
  await Order.findByIdAndDelete(id);
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  try {
    await connectToDB();
    const order = await Order.findById({ _id: id }).lean();
    return order ? (JSON.parse(JSON.stringify(order)) as IOrder) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// export async function updateOrder(values: IOrder) {
//   const id = values._id

//   const { number, customer, orderedGoods, totalPrice, status } = values

//   try {
//     await connectToDB()

//     const updateFields: Partial<IOrder> = {
//       number,
//       customer: customer
//         ? {
//             name: customer.name || "",
//             surname: customer.surname || "",
//             phone: customer.phone || "",
//             email: customer.email || "",
//             city: customer.city || "",
//             warehouse: customer.warehouse || "",
//             payment: customer.payment || ""
//           }
//         : undefined,
//       orderedGoods,
//       totalPrice,
//       status
//     }

//     Object.keys(updateFields).forEach(
//       key =>
//         (updateFields[key as keyof IOrder] === "" ||
//           updateFields[key as keyof IOrder] === undefined) &&
//         delete updateFields[key as keyof IOrder]
//     )

//     const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
//       new: true
//     }).lean()

//     if (!updatedOrder || Array.isArray(updatedOrder)) {
//       throw new Error("Failed to update order: No document returned or multiple documents returned")
//     }

//     return { success: true, message: "Замовлення оновлено успішно" }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error updating order:", error)
//       throw new Error("Failed to update order: " + error.message)
//     } else {
//       console.error("Unknown error:", error)
//       throw new Error("Failed to update order: Unknown error")
//     }
//   } finally {
//     revalidatePath("/admin/orders")
//     redirect("/admin/orders")
//   }
// }

export async function updateOrder(values: IOrder) {
  const id = values._id;

  const { number, customer, orderedGoods, totalPrice, status } = values;

  try {
    // Підключення до БД
    await connectToDB();

    // Формуємо часткові дані для оновлення
    const updateFields: Partial<IOrder> = {
      number,
      customer: customer
        ? {
            name: customer.name || '',
            surname: customer.surname || '',
            phone: customer.phone || '',
            email: customer.email || '',
            city: customer.city || '',
            warehouse: customer.warehouse || '',
            payment: customer.payment || '',
          }
        : undefined,
      orderedGoods,
      totalPrice,
      status,
    };

    // Видаляємо порожні або невизначені поля з updateFields
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof IOrder] === '' ||
          updateFields[key as keyof IOrder] === undefined) &&
        delete updateFields[key as keyof IOrder]
    );

    // Оновлення в базі даних
    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).lean();

    if (!updatedOrder || Array.isArray(updatedOrder)) {
      throw new Error(
        'Failed to update order: No document returned or multiple documents returned'
      );
    }

    // Успішне оновлення
    return { success: true, message: 'Замовлення оновлено успішно' };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating order:', error);
      // Повертати вищий рівень помилки для подальшого оброблення
      return {
        success: false,
        message: 'Помилка при оновленні замовлення: ' + error.message,
      };
    } else {
      console.error('Unknown error:', error);
      return {
        success: false,
        message: 'Неизвесная помилка при оновленні замовлення',
      };
    }
  } finally {
    // Перезавантаження шляхів після оновлення
    revalidatePath('/admin/orders');
    redirect('/admin/orders');
  }
}
