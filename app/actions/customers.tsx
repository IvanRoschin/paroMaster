'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { buildPagination } from '@/helpers/index';
import Customer from '@/models/Customer';
import { ICustomer, ICustomerSnapshot, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

interface IGetAllCostomers {
  success: boolean;
  customers: ICustomer[];
  count: number;
}

export async function getAllCustomers(
  searchParams: ISearchParams
): Promise<IGetAllCostomers> {
  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);

  try {
    await connectToDB();

    const count = await Customer.countDocuments();

    const customers: ICustomer[] = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      success: true,
      customers: JSON.parse(JSON.stringify(customers)),
      count: count,
    };
  } catch (error) {
    console.log(error);
    return { success: false, customers: [], count: 0 };
  }
}

export async function addCustomer(values: string | ICustomerSnapshot) {
  try {
    await connectToDB();

    // --- 1️⃣ Если передан ObjectId (строка) ---
    if (typeof values === 'string' && mongoose.Types.ObjectId.isValid(values)) {
      const existingCustomer = await Customer.findById(values);
      if (existingCustomer) {
        return {
          success: true,
          message: 'Customer already exists by ID',
          customer: existingCustomer,
        };
      } else {
        return {
          success: false,
          message: 'Customer ID not found in database',
        };
      }
    }

    // --- 2️⃣ Если передан объект (снапшот клиента) ---
    const snapshot = values as ICustomerSnapshot;

    if (!snapshot?.phone) {
      return {
        success: false,
        message: 'Missing phone number in customer snapshot',
      };
    }

    // Проверяем, есть ли уже клиент с таким телефоном
    const existingCustomer = await Customer.findOne({ phone: snapshot.phone });
    if (existingCustomer) {
      return {
        success: true,
        message: 'Customer already exists (by phone)',
        customer: existingCustomer,
      };
    }

    // Создаём нового клиента
    const newCustomer = await Customer.create({
      name: snapshot.name,
      surname: snapshot.surname,
      phone: snapshot.phone,
      email: snapshot.email,
      city: snapshot.city,
      warehouse: snapshot.warehouse,
      payment: snapshot.payment,
    });

    return {
      success: true,
      message: 'New customer created successfully',
      customer: newCustomer,
    };
  } catch (error) {
    console.error('Error adding customer:', error);
    if (error instanceof Error) {
      throw new Error('Failed to add customer: ' + error.message);
    } else {
      throw new Error('Failed to add customer: Unknown error');
    }
  } finally {
    revalidatePath('/admin/customers');
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  if (!id) return;
  await connectToDB();
  await Customer.findByIdAndDelete(id);
}

export async function getCustomerById(id: string) {
  try {
    await connectToDB();
    const customer = await Customer.findById({ _id: id }).lean();
    return JSON.parse(JSON.stringify(customer));
  } catch (error) {
    console.log(error);
  }
}

export async function updateCustomer(values: ICustomer) {
  function serializeCustomer(customer: any) {
    return {
      ...customer,
      _id: customer._id.toString(),
      createdAt: customer.createdAt?.toISOString(),
      updatedAt: customer.updatedAt?.toISOString(),
      orders: customer.orders?.map((order: any) => ({
        ...order,
        _id: order._id.toString(),
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString(),
      })),
    };
  }

  if (!values._id) {
    throw new Error('Customer ID is required for update');
  }

  const { _id, name, phone, email, city, warehouse, payment } = values;

  try {
    await connectToDB();

    // Створюємо тільки ті поля, які не пусті
    const updateFields: Partial<ICustomer> = {
      name,
      phone,
      email,
      city,
      warehouse,
      payment,
    };
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof ICustomer] === '' ||
          updateFields[key as keyof ICustomer] === undefined) &&
        delete updateFields[key as keyof ICustomer]
    );

    // Оновлюємо документ
    const updatedCustomer = await Customer.findByIdAndUpdate(
      _id,
      updateFields,
      {
        new: true, // повертає оновлений документ
      }
    ).lean();

    if (!updatedCustomer) {
      throw new Error(`Customer with ID ${_id} not found`);
    }

    return {
      success: true,
      message: 'Customer updated successfully',
      data: serializeCustomer(updatedCustomer),
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    throw new Error(
      'Failed to update customer: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
