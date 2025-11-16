'use server';

import { buildPagination } from '@/helpers/index';
import toPlain from '@/helpers/server/toPlain';
import Customer from '@/models/Customer';
import { ICustomer, ISearchParams } from '@/types';
import { connectToDB } from '@/utils/dbConnect';

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

export async function getCustomerByUserService(userId: string) {
  await connectToDB();

  const doc = await Customer.findOne({ user: userId }).populate('user');
  return doc ? toPlain(doc) : null;
}
