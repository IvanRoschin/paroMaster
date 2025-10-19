'use server';
import { sendTelegramMessage } from 'app/lib/telegram';
import { revalidatePath } from 'next/cache';

import { buildPagination, buildSort } from '@/helpers/index';
import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { IOrder, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

interface IGetAllOrdersResponse {
  success: boolean;
  orders: IOrder[];
  count: number;
}

export async function getAllOrders(
  searchParams: ISearchParams
): Promise<IGetAllOrdersResponse> {
  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);
  const sortOption = buildSort(searchParams);

  const status = searchParams.status;
  const filter: any = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  try {
    await connectToDB();

    const count = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('customer')
      .populate('orderedGoods.good')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
      count,
    };
  } catch (error) {
    console.log('Error getting orders:', error);
    return { success: false, orders: [], count: 0 };
  }
}

export const deleteGoodsFromOrder = async (
  orderId: string,
  goodsId: string
) => {
  try {
    await connectToDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const updatedGoods = order.orderedGoods.filter(
      (good: any) => good.good.toString() !== goodsId
    );

    order.orderedGoods = updatedGoods;
    order.totalPrice = updatedGoods.reduce(
      (total: number, good: any) => total + good.price * good.quantity,
      0
    );

    await order.save();

    revalidatePath('/admin/orders');
    return { success: true, message: 'Goods deleted successfully' };
  } catch (error) {
    console.error('Error deleting goods:', error);
    return { success: false, message: 'Failed to delete goods' };
  }
};

export async function addOrder(values: IOrder) {
  if (!values.number) {
    values.number = `ORD-${Date.now()}`;
  }

  try {
    await connectToDB();

    // 1. Проверяем, есть ли уже такой customer
    let customer = await Customer.findOne({
      $or: [
        { email: values.customerSnapshot.email },
        { phone: values.customerSnapshot.phone },
      ],
    });

    // 2. Если нет — создаём
    if (!customer) {
      customer = await Customer.create({
        ...values.customerSnapshot,
        orders: [], // Будет заполнено после создания заказа
      });
    }

    // Подготавливаем orderedGoods с ObjectId
    const orderedGoodsWithIds = values.orderedGoods.map((good: any) => ({
      good: good.good._id || good.good, // Поддержка как ID так и полного объекта
      quantity: good.quantity,
      price: good.price,
    }));

    const order = await Order.create({
      number: values.number,
      customer: customer._id,
      customerSnapshot: values.customerSnapshot,
      orderedGoods: orderedGoodsWithIds,
      totalPrice: values.totalPrice,
      status: values.status || 'NEW',
    });

    // Добавляем заказ в массив заказов клиента
    customer.orders.push(order._id);
    await customer.save();

    const msg = `✅ <b>Створено нове замовлення!</b>\n🧾 Замовлення: ${values.number} \n Від замовника ${values.customerSnapshot.name}  ${values.customerSnapshot.surname}\n💰 На суму: ${values.totalPrice}  \n Телефон замовника ${values.customerSnapshot.phone}`;
    await sendTelegramMessage(msg);

    revalidatePath('/admin/orders');
    return {
      success: true,
      message: 'New Order created successfully',
    };
  } catch (error) {
    console.error('Error adding order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add order',
    };
  }
}

export async function deleteOrder(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id) {
    return { success: false, message: 'Order ID is required' };
  }

  try {
    await connectToDB();

    // Удаляем заказ из массива заказов клиента
    const order = await Order.findById(id);
    if (order && order.customer) {
      await Customer.updateOne(
        { _id: order.customer },
        { $pull: { orders: id } }
      );
    }

    await Order.findByIdAndDelete(id);

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

export async function getOrderById(id: string): Promise<IOrder | null> {
  try {
    await connectToDB();
    const order = await Order.findById(id)
      .populate('customer')
      .populate('orderedGoods.good')
      .lean();
    return order ? (JSON.parse(JSON.stringify(order)) as IOrder) : null;
  } catch (error) {
    console.log('Error getting order:', error);
    return null;
  }
}

export async function updateOrder(values: IOrder) {
  const id = values._id;

  if (!id) {
    return { success: false, message: 'Order ID is required' };
  }

  const { number, customerSnapshot, orderedGoods, totalPrice, status } = values;

  try {
    await connectToDB();

    // Подготавливаем orderedGoods с ObjectId
    const orderedGoodsWithIds = orderedGoods.map((good: any) => ({
      good: good.good._id || good.good,
      quantity: good.quantity,
      price: good.price,
    }));

    const updateFields: Partial<IOrder> = {
      number,
      customerSnapshot: customerSnapshot
        ? {
            name: customerSnapshot.name || '',
            surname: customerSnapshot.surname || '',
            phone: customerSnapshot.phone || '',
            email: customerSnapshot.email || '',
            city: customerSnapshot.city || '',
            warehouse: customerSnapshot.warehouse || '',
            payment: customerSnapshot.payment || '',
          }
        : undefined,
      orderedGoods: orderedGoodsWithIds,
      totalPrice,
      status,
    };

    // Видаляємо порожні поля
    Object.keys(updateFields).forEach(key => {
      const value = updateFields[key as keyof Partial<IOrder>];
      if (value === '' || value === undefined || value === null) {
        delete updateFields[key as keyof Partial<IOrder>];
      }
    });

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).lean();

    if (!updatedOrder) {
      return {
        success: false,
        message: 'Failed to update order: Order not found',
      };
    }

    revalidatePath('/admin/orders');
    return { success: true, message: 'Замовлення оновлено успішно' };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update order',
    };
  }
}
