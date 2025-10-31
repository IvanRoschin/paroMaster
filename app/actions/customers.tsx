'use server';

import mongoose, { HydratedDocument } from 'mongoose';

import Customer from '@/models/Customer';
import { ICustomer } from '@/types/ICustomer';
import { connectToDB } from '@/utils/dbConnect';

interface IGetAllCostomers {
  success: boolean;
  customers: ICustomer[];
  count: number;
}

export async function addCustomer(values: {
  user: mongoose.Types.ObjectId | string;
  city: string;
  warehouse: string;
  payment: string;
}): Promise<{
  success: boolean;
  message: string;
  customer: ICustomer | HydratedDocument<ICustomer>;
}> {
  try {
    await connectToDB();

    // Проверяем, есть ли Customer с таким user
    let existingCustomer = await Customer.findOne({ user: values.user });

    if (existingCustomer) {
      // Обновляем актуальные данные
      existingCustomer.city = values.city;
      existingCustomer.warehouse = values.warehouse;
      existingCustomer.payment = values.payment;
      await existingCustomer.save();

      return {
        success: true,
        message: 'Customer updated successfully',
        customer: JSON.parse(
          JSON.stringify(existingCustomer.toObject({ getters: true }))
        ),
      };
    }

    // Создаём нового
    const newCustomer = await Customer.create({
      user: values.user,
      city: values.city,
      warehouse: values.warehouse,
      payment: values.payment,
      orders: [],
    });

    return {
      success: true,
      message: 'New customer created successfully',
      customer: JSON.parse(
        JSON.stringify(newCustomer.toObject({ getters: true }))
      ),
    };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw new Error(
      'Failed to add customer: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

// export async function getAllCustomers(
//   searchParams: ISearchParams
// ): Promise<IGetAllCostomers> {
//   const currentPage = Number(searchParams.page) || 1;
//   const { skip, limit } = buildPagination(searchParams, currentPage);

//   try {
//     await connectToDB();

//     const count = await Customer.countDocuments();

//     const customers: ICustomer[] = await Customer.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     return {
//       success: true,
//       customers: JSON.parse(JSON.stringify(customers)),
//       count: count,
//     };
//   } catch (error) {
//     console.log(error);
//     return { success: false, customers: [], count: 0 };
//   }
// }

// export async function deleteCustomer(id: string): Promise<void> {
//   if (!id) return;
//   await connectToDB();
//   await Customer.findByIdAndDelete(id);
// }

// export async function getCustomerById(id: string) {
//   try {
//     await connectToDB();
//     const customer = await Customer.findById({ _id: id }).lean();
//     return JSON.parse(JSON.stringify(customer));
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function updateCustomer(values: ICustomer) {
//   function serializeCustomer(customer: any) {
//     return {
//       ...customer,
//       _id: customer._id.toString(),
//       createdAt: customer.createdAt?.toISOString(),
//       updatedAt: customer.updatedAt?.toISOString(),
//       orders: customer.orders?.map((order: any) => ({
//         ...order,
//         _id: order._id.toString(),
//         createdAt: order.createdAt?.toISOString(),
//         updatedAt: order.updatedAt?.toISOString(),
//       })),
//     };
//   }

//   if (!values._id) {
//     throw new Error('Customer ID is required for update');
//   }

//   const { _id, name, phone, email, city, warehouse, payment } = values;

//   try {
//     await connectToDB();

//     // Створюємо тільки ті поля, які не пусті
//     const updateFields: Partial<ICustomer> = {
//       name,
//       phone,
//       email,
//       city,
//       warehouse,
//       payment,
//     };
//     Object.keys(updateFields).forEach(
//       key =>
//         (updateFields[key as keyof ICustomer] === '' ||
//           updateFields[key as keyof ICustomer] === undefined) &&
//         delete updateFields[key as keyof ICustomer]
//     );

//     // Оновлюємо документ
//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       _id,
//       updateFields,
//       {
//         new: true, // повертає оновлений документ
//       }
//     ).lean();

//     if (!updatedCustomer) {
//       throw new Error(`Customer with ID ${_id} not found`);
//     }

//     return {
//       success: true,
//       message: 'Customer updated successfully',
//       data: serializeCustomer(updatedCustomer),
//     };
//   } catch (error) {
//     console.error('Error updating customer:', error);
//     throw new Error(
//       'Failed to update customer: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }
