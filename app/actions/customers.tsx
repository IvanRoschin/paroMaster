'use server';

import { revalidatePath } from 'next/cache';

import {
  addCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  getCustomerByUserService,
  toggleFavoriteService,
  updateCustomerFieldService,
  updateCustomerService,
} from '@/app/services/customerService';
import { ICustomer } from '@/types';
import { ICustomerUI } from '@/types/ICustomer';

export interface IGetAllCustomers {
  success: boolean;
  customers: ICustomerUI[];
  count: number;
}

export interface CustomerFilters {
  page?: string | number;
  limit?: string | number;
}

export async function addCustomerAction(values: Partial<ICustomer>) {
  console.log('valuse in action', values);

  const result = await addCustomerService(values);
  revalidatePath('/admin/customers');
  return result;
}

export async function getAllCustomersAction(
  filters: CustomerFilters = {}
): Promise<IGetAllCustomers> {
  return getAllCustomersService(filters);
}

export async function getCustomerByIdAction(id: string) {
  return getCustomerByIdService(id);
}

export async function getCustomerByUserAction(userId: string) {
  return getCustomerByUserService(userId);
}

export async function deleteCustomerAction(id: string) {
  const result = await deleteCustomerService(id);
  revalidatePath('/admin/customers');
  return result;
}

export async function updateCustomerAction(
  id: string,
  values: Partial<ICustomer>
) {
  const result = await updateCustomerService(id, values);
  revalidatePath('/admin/customers');
  return result;
}

export async function updateCustomerFieldAction(
  customerId: string,
  customerField: 'city' | 'warehouse' | 'payment',
  value: string
) {
  const res = await updateCustomerFieldService(
    customerId,
    customerField,
    value
  );
  if (res.success) {
    revalidatePath('/profile');
  }
  return res;
}

export async function toggleFavoriteAction(goodId: string) {
  return toggleFavoriteService(goodId);
}

// 'use server';

// import mongoose, { HydratedDocument } from 'mongoose';

// import Customer from '@/models/Customer';
// import { ICustomer } from '@/types/ICustomer';
// import { connectToDB } from '@/utils/dbConnect';

// import { serializeDoc } from '../lib';

// interface IGetAllCostomers {
//   success: boolean;
//   customers: ICustomer[];
//   count: number;
// }

// export async function addCustomer(values: {
//   user: mongoose.Types.ObjectId | string;
//   city: string;
//   warehouse: string;
//   payment: string;
// }): Promise<{
//   success: boolean;
//   message: string;
//   customer: ICustomer | HydratedDocument<ICustomer>;
// }> {
//   try {
//     await connectToDB();

//     // Проверяем, есть ли Customer с таким user
//     let existingCustomer = await Customer.findOne({ user: values.user });

//     if (existingCustomer) {
//       // Обновляем актуальные данные
//       existingCustomer.city = values.city;
//       existingCustomer.warehouse = values.warehouse;
//       existingCustomer.payment = values.payment;
//       await existingCustomer.save();

//       return {
//         success: true,
//         message: 'Customer updated successfully',
//         customer: serializeDoc<ICustomer>(existingCustomer),
//       };
//     }

//     // Создаём нового
//     const newCustomer = await Customer.create({
//       user: values.user,
//       city: values.city,
//       warehouse: values.warehouse,
//       payment: values.payment,
//       orders: [],
//     });

//     return {
//       success: true,
//       message: 'New customer created successfully',
//       customer: serializeDoc<ICustomer>(newCustomer),
//     };
//   } catch (error) {
//     console.error('Error adding customer:', error);
//     throw new Error(
//       'Failed to add customer: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function getAllCustomers(): Promise<{
//   success: boolean;
//   customers: ICustomer[];
//   count: number;
// }> {
//   try {
//     await connectToDB();

//     const customers = await Customer.find({}).populate('user');
//     const count = await Customer.countDocuments();

//     return {
//       success: true,
//       customers: customers.map(c => serializeDoc<ICustomer>(c)),
//       count,
//     };
//   } catch (error) {
//     console.error('Error fetching customers:', error);
//     throw new Error(
//       'Failed to fetch customers: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function deleteCustomer(id: string): Promise<{
//   success: boolean;
//   message: string;
// }> {
//   try {
//     await connectToDB();

//     const deleted = await Customer.findByIdAndDelete(id);

//     if (!deleted) {
//       return { success: false, message: 'Customer not found' };
//     }

//     return { success: true, message: 'Customer deleted successfully' };
//   } catch (error) {
//     console.error('Error deleting customer:', error);
//     throw new Error(
//       'Failed to delete customer: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function getCustomerById(id: string): Promise<{
//   success: boolean;
//   customer?: ICustomer;
//   message?: string;
// }> {
//   try {
//     await connectToDB();

//     const customer = await Customer.findById(id).populate('user');

//     if (!customer) {
//       return { success: false, message: 'Customer not found' };
//     }

//     return { success: true, customer: serializeDoc(customer) };
//   } catch (error) {
//     console.error('Error fetching customer:', error);
//     throw new Error(
//       'Failed to fetch customer: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function updateCustomer(
//   id: string,
//   values: {
//     city?: string;
//     warehouse?: string;
//     payment?: string;
//   }
// ): Promise<{
//   success: boolean;
//   message: string;
//   customer?: ICustomer;
// }> {
//   try {
//     await connectToDB();

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return { success: false, message: 'Customer not found' };
//     }

//     if (values.city !== undefined) customer.city = values.city;
//     if (values.warehouse !== undefined) customer.warehouse = values.warehouse;
//     if (values.payment !== undefined) customer.payment = values.payment;

//     await customer.save();

//     return {
//       success: true,
//       message: 'Customer updated successfully',
//       customer: serializeDoc(customer),
//     };
//   } catch (error) {
//     console.error('Error updating customer:', error);
//     throw new Error(
//       'Failed to update customer: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }
