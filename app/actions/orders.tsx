'use server';
import { sendTelegramMessage } from 'app/lib/telegram';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { IOrder } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

import { serializeDoc } from '../lib';
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
      user: new mongoose.Types.ObjectId(userId),
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
          name: values.customerSnapshot.user.name,
          surname: values.customerSnapshot.user.surname,
          email: values.customerSnapshot.user.email,
          phone: values.customerSnapshot.user.phone,
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
      order: serializeDoc<IOrder>(order),
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
/** Получение всех заказов */
export async function getAllOrders(): Promise<{
  success: boolean;
  orders: IOrder[];
  count: number;
}> {
  try {
    await connectToDB();

    const orders = await Order.find()
      .populate({
        path: 'customer',
        select: 'user city warehouse payment',
        populate: { path: 'user', select: 'name surname email phone' },
      })
      .populate({
        path: 'orderedGoods.good',
        select: 'title price discountPrice src',
      })
      .lean();

    const count = await Order.countDocuments();

    return {
      success: true,
      orders: orders.map(order => serializeDoc<IOrder>(order)),
      count,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, orders: [], count: 0 };
  }
}

/** Получение заказа по ID */
export async function getOrderById(id: string): Promise<IOrder | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    await connectToDB();
    const order = await Order.findById(id)
      .populate({
        path: 'customer',
        select: 'user city warehouse payment',
        populate: { path: 'user', select: 'name surname email phone' },
      })
      .populate('orderedGoods.good')
      .lean();

    return order ? serializeDoc<IOrder>(order) : null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

/** Обновление заказа */
export async function updateOrder(values: IOrder): Promise<{
  success: boolean;
  message: string;
}> {
  const { _id, orderedGoods, customerSnapshot, number, totalPrice, status } =
    values;
  if (!_id) return { success: false, message: 'Order ID is required' };

  try {
    await connectToDB();

    const updatedGoods = orderedGoods?.map(g => ({
      good: typeof g.good === 'object' && g.good !== null ? g.good._id : g.good,
      quantity: g.quantity,
      price: g.price,
    }));

    const updateFields: Partial<IOrder> = {
      number,
      customerSnapshot: customerSnapshot
        ? {
            user: customerSnapshot.user,
            city: customerSnapshot.city,
            warehouse: customerSnapshot.warehouse,
            payment: customerSnapshot.payment,
          }
        : undefined,
      orderedGoods: updatedGoods,
      totalPrice,
      status,
    };

    // Убираем пустые поля
    Object.keys(updateFields).forEach(key => {
      const value = updateFields[key as keyof typeof updateFields];
      if (value === undefined || value === null)
        delete updateFields[key as keyof typeof updateFields];
    });

    const updatedOrder = await Order.findByIdAndUpdate(_id, updateFields, {
      new: true,
    }).lean();
    if (!updatedOrder) return { success: false, message: 'Order not found' };

    revalidatePath('/admin/orders');
    return { success: true, message: 'Order updated successfully' };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update order',
    };
  }
}

/** Удаление заказа */
export async function deleteOrder(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return { success: false, message: 'Invalid Order ID' };

  try {
    await connectToDB();

    const order = await Order.findById(id);
    if (!order) return { success: false, message: 'Order not found' };

    // Удаляем ссылку на заказ из Customer.orders
    if (order.customer && mongoose.Types.ObjectId.isValid(order.customer)) {
      await Customer.updateOne(
        { _id: order.customer },
        { $pull: { orders: order._id } }
      );
    }

    await Order.findByIdAndDelete(order._id);

    revalidatePath('/admin/orders');
    return { success: true, message: 'Order deleted successfully' };
  } catch (error) {
    console.error('Error deleting order:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete order',
    };
  }
}
