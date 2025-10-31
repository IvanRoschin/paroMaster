'use server';
import { sendTelegramMessage } from 'app/lib/telegram';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { IOrder } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

import { addCustomer } from './customers';
import { addUser } from './users';

interface IGetAllOrdersResponse {
  success: boolean;
  orders: IOrder[];
  count: number;
}

export async function addOrder(values: IOrder) {
  try {
    await connectToDB();

    // 1️⃣ Проверяем/создаём User
    const { success: userOk, user } = await addUser(
      values.customerSnapshot.user
    );
    if (!userOk || !user) throw new Error('Не вдалося створити користувача');

    const userId = user._id;
    if (!userId) throw new Error('User ID is missing');

    // 2️⃣ Проверяем/создаём Customer через Mongoose документ
    const { success: custOk, customer: customerDoc } = await addCustomer({
      user: new mongoose.Types.ObjectId(userId), // обязательно ObjectId
      city: values.customerSnapshot.city,
      warehouse: values.customerSnapshot.warehouse,
      payment: values.customerSnapshot.payment,
    });

    if (!custOk || !customerDoc)
      throw new Error('Не вдалося створити кастомера');

    // Приводим к документу Mongoose для save
    const customer = await Customer.findById(customerDoc._id);
    if (!customer) throw new Error('Customer document not found');

    // 3️⃣ Подготавливаем товары
    const orderedGoodsWithIds = values.orderedGoods.map((g: any) => ({
      good: g.good._id || g.good,
      quantity: g.quantity,
      price: g.price,
    }));

    // 4️⃣ Создаём заказ
    const order = await Order.create({
      number: values.number || `ORD-${Date.now()}`,
      customer: customer._id,
      customerSnapshot: {
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
        },
        city: values.customerSnapshot.city,
        warehouse: values.customerSnapshot.warehouse,
        payment: values.customerSnapshot.payment,
      },
      orderedGoods: orderedGoodsWithIds,
      totalPrice: values.totalPrice,
      status: values.status || 'NEW',
    });

    // 5️⃣ Обновляем customer.orders через Mongoose документ
    customer.orders = customer.orders || [];
    customer.orders.push(order._id);
    await customer.save();

    // 6️⃣ Telegram уведомление
    const msg = `✅ <b>Створено нове замовлення!</b>\n🧾 Замовлення: ${order.number}\n👤 ${user.name} ${user.surname}\n📞 ${user.phone}\n🏙️ ${values.customerSnapshot.city}\n💰 На суму: ${values.totalPrice}`;
    await sendTelegramMessage(msg);

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order created successfully',
      order: JSON.parse(JSON.stringify(order.toObject({ getters: true }))),
    };
  } catch (error) {
    console.error('Error adding order:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

// export async function getAllOrders(searchParams: ISearchParams) {
//   const currentPage = Number(searchParams.page) || 1;
//   const { skip, limit } = buildPagination(searchParams, currentPage);
//   const sortOption = buildSort(searchParams);

//   const filter: any = {};

//   if (searchParams.status && searchParams.status !== 'all') {
//     filter.status = searchParams.status;
//   }

//   // Исключаем старые заказы с customer не-ObjectId
//   filter.$or = [
//     { customer: { $type: 'objectId' } },
//     { customer: { $exists: false } },
//   ];

//   try {
//     await connectToDB();

//     const count = await Order.countDocuments(filter);

//     const orders = await Order.find(filter)
//       .populate({
//         path: 'customer',
//         select: 'name surname email phone',
//       })
//       .populate({
//         path: 'orderedGoods.good',
//         select: 'title price discountPrice src',
//       })
//       .sort(sortOption)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return {
//       success: true,
//       order: order.toObject(),
//       count,
//     };
//   } catch (error) {
//     console.error('❌ Error getting orders:', error);
//     return { success: false, orders: [], count: 0 };
//   }
// }

// export const deleteGoodsFromOrder = async (
//   orderId: string,
//   goodsId: string
// ) => {
//   try {
//     await connectToDB();
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return { success: false, message: 'Order not found' };
//     }

//     const updatedGoods = order.orderedGoods.filter(
//       (good: any) => good.good.toString() !== goodsId
//     );

//     order.orderedGoods = updatedGoods;
//     order.totalPrice = updatedGoods.reduce(
//       (total: number, good: any) => total + good.price * good.quantity,
//       0
//     );

//     await order.save();

//     revalidatePath('/admin/orders');
//     return { success: true, message: 'Goods deleted successfully' };
//   } catch (error) {
//     console.error('Error deleting goods:', error);
//     return { success: false, message: 'Failed to delete goods' };
//   }
// };

// export async function deleteOrder(
//   id: string
// ): Promise<{ success: boolean; message: string }> {
//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     return { success: false, message: 'Invalid or missing Order ID' };
//   }

//   try {
//     await connectToDB();

//     const order = await Order.findById(id);
//     if (!order) {
//       return { success: false, message: 'Order not found' };
//     }

//     // Удаляем заказ из списка заказов клиента, если ссылка валидна
//     if (order.customer && mongoose.Types.ObjectId.isValid(order.customer)) {
//       await Customer.updateOne(
//         { _id: order.customer },
//         { $pull: { orders: order._id } }
//       );
//     } else {
//       console.warn(
//         `⚠️ Skipping customer unlink — invalid customer ID: ${order.customer}`
//       );
//     }

//     await Order.findByIdAndDelete(order._id);

//     revalidatePath('/admin/orders');
//     return { success: true, message: 'Order deleted successfully' };
//   } catch (error) {
//     console.error('❌ Error deleting order:', error);
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : 'Failed to delete order',
//     };
//   }
// }

// export async function getOrderById(id: string): Promise<IOrder | null> {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     console.error('Invalid order ID:', id);
//     return null;
//   }

//   try {
//     await connectToDB();
//     const order = await Order.findById(id)
//       .populate('customer')
//       .populate('orderedGoods.good')
//       .lean();
//     return order ? (JSON.parse(JSON.stringify(order)) as IOrder) : null;
//   } catch (error) {
//     console.log('Error getting order:', error);
//     return null;
//   }
// }

// export async function updateOrder(values: IOrder) {
//   const id = values._id;

//   if (!id) {
//     return { success: false, message: 'Order ID is required' };
//   }

//   const { number, customerSnapshot, orderedGoods, totalPrice, status } = values;

//   try {
//     await connectToDB();

//     // Подготавливаем orderedGoods с ObjectId
//     const orderedGoodsWithIds = orderedGoods.map((good: any) => ({
//       good: good.good._id || good.good,
//       quantity: good.quantity,
//       price: good.price,
//     }));

//     const updateFields: Partial<IOrder> = {
//       number,
//       customerSnapshot: customerSnapshot
//         ? {
//             name: customerSnapshot.name || '',
//             surname: customerSnapshot.surname || '',
//             phone: customerSnapshot.phone || '',
//             email: customerSnapshot.email || '',
//             city: customerSnapshot.city || '',
//             warehouse: customerSnapshot.warehouse || '',
//             payment: customerSnapshot.payment || '',
//           }
//         : undefined,
//       orderedGoods: orderedGoodsWithIds,
//       totalPrice,
//       status,
//     };

//     // Видаляємо порожні поля
//     Object.keys(updateFields).forEach(key => {
//       const value = updateFields[key as keyof Partial<IOrder>];
//       if (value === '' || value === undefined || value === null) {
//         delete updateFields[key as keyof Partial<IOrder>];
//       }
//     });

//     const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
//       new: true,
//     }).lean();

//     if (!updatedOrder) {
//       return {
//         success: false,
//         message: 'Failed to update order: Order not found',
//       };
//     }

//     revalidatePath('/admin/orders');
//     return { success: true, message: 'Замовлення оновлено успішно' };
//   } catch (error) {
//     console.error('Error updating order:', error);
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : 'Failed to update order',
//     };
//   }
// }
