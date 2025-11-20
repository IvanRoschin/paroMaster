'use server';

import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';

import { buildPagination } from '@/helpers/index';
import toPlain from '@/helpers/server/toPlain';
import Customer from '@/models/Customer';
import Good from '@/models/Good';
import { ICustomer, ISearchParams } from '@/types';
import { connectToDB } from '@/utils/dbConnect';

import { authOptions } from '../config/authOptions';

export interface IGoodWithFavorite {
  _id: string;
  title: string;
  price: number;
  brand?: { _id: string; name: string; slug?: string };
  src?: string[];
  isFavorite: boolean;
}

export async function addCustomerService(values: Partial<ICustomer>) {
  await connectToDB();

  if (!values.user) {
    return { success: false, message: `Поле 'user' обов'язкове` };
  }

  // Проверяем, есть ли Customer по user
  const existing = await Customer.findOne({ user: values.user });

  if (existing) {
    // Обновляем
    if (values.city !== undefined) existing.city = values.city;
    if (values.warehouse !== undefined) existing.warehouse = values.warehouse;
    if (values.payment !== undefined) existing.payment = values.payment;

    await existing.save();

    return {
      success: true,
      message: 'Дані клієнта оновлено',
      customer: toPlain(existing),
    };
  }

  // Создаем нового
  const created = await Customer.create({
    user: values.user,
    city: values.city,
    warehouse: values.warehouse,
    payment: values.payment,
    orders: [],
  });

  return {
    success: true,
    message: 'Клієнта додано успішно',
    customer: toPlain(created),
  };
}

export async function getAllCustomersService(searchParams: ISearchParams = {}) {
  await connectToDB();

  const count = await Customer.countDocuments();

  const query = Customer.find().populate('user');

  if (searchParams.page) {
    const currentPage = Number(searchParams.page) || 1;
    const { skip, limit } = buildPagination(searchParams, currentPage);
    query.skip(skip).limit(limit);
  }

  const docs = await query.exec();

  return {
    success: true,
    customers: JSON.parse(JSON.stringify(docs)),
    count,
  };
}

export async function getCustomerByIdService(id: string) {
  if (!id) return null;

  await connectToDB();
  const doc = await Customer.findById(id).populate('user');

  return doc ? toPlain(doc) : null;
}

export async function deleteCustomerService(id: string) {
  if (!id) return { success: false, message: 'ID не передано' };

  await connectToDB();
  await Customer.findByIdAndDelete(id);

  return { success: true, message: 'Клієнта видалено' };
}

export async function updateCustomerService(
  id: string,
  values: Partial<ICustomer>
) {
  await connectToDB();

  const updateFields = { ...values };

  // Удаляем пустые поля
  Object.keys(updateFields).forEach(key => {
    const typedKey = key as keyof ICustomer;
    const val = updateFields[typedKey];

    if (val === '' || val === undefined) {
      delete updateFields[typedKey];
    }
  });

  const doc = await Customer.findByIdAndUpdate(id, updateFields, {
    new: true,
  }).populate('user');

  return {
    success: true,
    message: 'Дані клієнта оновлено',
    customer: toPlain(doc),
  };
}

export async function updateCustomerFieldService(
  customerId: string,
  field: 'city' | 'warehouse' | 'payment',
  value: string
) {
  if (!customerId)
    return { success: false, message: 'Користувач не авторизований' };
  await connectToDB();

  const customer = await Customer.findById(customerId);
  if (!customer) return { success: false, message: 'Користувача не знайдено' };

  customer[field] = value;
  await customer.save();

  return {
    success: true,
    message: 'Дані успішно оновлено',
    customer: toPlain(customer),
  };
}

export async function getCustomerByUserService(userId: string) {
  await connectToDB();

  const doc = await Customer.findOne({ user: userId }).populate('user');
  return doc ? toPlain(doc) : null;
}

export async function toggleFavoriteService(goodId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return {
      success: false,
      message:
        'Тільки авторизовані користувачі можуть додавати Товари до улюблених',
    };

  const { _id } = session.user;
  await connectToDB();

  const customer = await Customer.findOne({ user: _id });

  if (!customer) throw new Error('Customer not found');

  const isFav = customer.favorites.some(
    (f: mongoose.Types.ObjectId) => f.toString() === goodId
  );

  const update = isFav
    ? { $pull: { favorites: goodId } }
    : { $addToSet: { favorites: goodId } };

  const updated = await Customer.findOneAndUpdate({ user: _id }, update, {
    new: true,
  });

  const favoritesStrings = updated!.favorites.map(
    (f: mongoose.Types.ObjectId) => f.toString()
  );

  return { favorites: favoritesStrings };
}

export async function getGoodsWithFavoriteService() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  await connectToDB();

  // получаем пользователя/клиента
  const customerDoc = await Customer.findOne({ user: session.user._id });
  const favorites =
    customerDoc?.favorites.map((f: mongoose.Types.ObjectId) => f.toString()) ||
    [];

  // получаем все товары
  const goodsDocs = await Good.find().populate('brand', 'name slug').lean();

  // преобразуем в обычные объекты и добавляем isFavorite
  const goods: IGoodWithFavorite[] = goodsDocs.map(g => ({
    ...toPlain(g),
    isFavorite: favorites.includes(
      (g._id as mongoose.Types.ObjectId).toString()
    ),
  }));

  return goods;
}
