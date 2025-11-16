'use server';

import { sendTelegramMessage } from 'app/lib/telegram';
import mongoose from 'mongoose';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { IOrder } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

import { serializeDoc } from '../lib';
import { addCustomerService } from './customerService';
import { addUserService } from './userService';

export async function addOrderService(values: IOrder) {
  await connectToDB();

  // 1️⃣ User
  const { success: userOk, user } = await addUserService(
    values.customerSnapshot.user
  );
  if (!userOk || !user)
    return { success: false, message: 'Не вдалося створити користувача' };

  const userId = user._id;
  if (!userId) return { success: false, message: 'User ID is missing' };

  // 2️⃣ Customer
  const { success: custOk, customer: customerDoc } = await addCustomerService({
    user: new mongoose.Types.ObjectId(userId),
    city: values.customerSnapshot.city,
    warehouse: values.customerSnapshot.warehouse,
    payment: values.customerSnapshot.payment,
  });
  if (!custOk || !customerDoc)
    return { success: false, message: 'Не вдалося створити кастомера' };

  const customer = await Customer.findById(customerDoc._id);
  if (!customer)
    return { success: false, message: 'Customer document not found' };

  // 3️⃣ Ordered goods
  const orderedGoodsWithIds = values.orderedGoods.map(g => ({
    good: typeof g.good === 'object' && g.good !== null ? g.good._id : g.good,
    quantity: g.quantity,
    price: g.price,
  }));

  // 4️⃣ Create order
  const order = await Order.create({
    number: values.number || `ORD-${Date.now()}`,
    customer: customer._id,
    customerSnapshot: {
      user: values.customerSnapshot.user,
      city: values.customerSnapshot.city,
      warehouse: values.customerSnapshot.warehouse,
      payment: values.customerSnapshot.payment,
    },
    orderedGoods: orderedGoodsWithIds,
    totalPrice: values.totalPrice,
    status: values.status || 'NEW',
  });

  // 5️⃣ Update Customer.orders
  customer.orders = customer.orders || [];
  customer.orders.push(order._id);
  await customer.save();

  // 6️⃣ Telegram
  const msg = `✅ <b>Створено нове замовлення!</b>\n🧾 Замовлення: ${order.number}\n👤 ${user.name} ${user.surname}\n📞 ${user.phone}\n🏙️ ${values.customerSnapshot.city}\n💰 На суму: ${values.totalPrice}`;
  await sendTelegramMessage(msg);

  return {
    success: true,
    message: 'Order created successfully',
    order: serializeDoc<IOrder>(order),
  };
}

export async function getAllOrdersService(): Promise<{
  success: boolean;
  orders: IOrder[];
  count: number;
}> {
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
    orders: orders.map(o => serializeDoc<IOrder>(o)),
    count,
  };
}

export async function getOrderByIdService(id: string): Promise<IOrder | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

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
}

export async function updateOrderService(
  values: IOrder
): Promise<{ success: boolean; message: string }> {
  if (!values._id) return { success: false, message: 'Order ID is required' };

  await connectToDB();

  const updatedGoods = values.orderedGoods?.map(g => ({
    good: typeof g.good === 'object' && g.good !== null ? g.good._id : g.good,
    quantity: g.quantity,
    price: g.price,
  }));

  const updateFields: Partial<IOrder> = {
    number: values.number,
    customerSnapshot: values.customerSnapshot
      ? {
          user: values.customerSnapshot.user,
          city: values.customerSnapshot.city,
          warehouse: values.customerSnapshot.warehouse,
          payment: values.customerSnapshot.payment,
        }
      : undefined,
    orderedGoods: updatedGoods,
    totalPrice: values.totalPrice,
    status: values.status,
  };

  Object.keys(updateFields).forEach(key => {
    const val = updateFields[key as keyof typeof updateFields];
    if (val === undefined || val === null)
      delete updateFields[key as keyof typeof updateFields];
  });

  const updatedOrder = await Order.findByIdAndUpdate(values._id, updateFields, {
    new: true,
  }).lean();
  if (!updatedOrder) return { success: false, message: 'Order not found' };

  return { success: true, message: 'Order updated successfully' };
}

export async function deleteOrderService(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return { success: false, message: 'Invalid Order ID' };

  await connectToDB();

  const order = await Order.findById(id);
  if (!order) return { success: false, message: 'Order not found' };

  if (order.customer && mongoose.Types.ObjectId.isValid(order.customer)) {
    await Customer.updateOne(
      { _id: order.customer },
      { $pull: { orders: order._id } }
    );
  }

  await Order.findByIdAndDelete(order._id);

  return { success: true, message: 'Order deleted successfully' };
}
