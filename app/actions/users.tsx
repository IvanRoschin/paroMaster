'use server';

import bcrypt from 'bcrypt';

import User from '@/models/User';
import { IUser } from '@/types/index';
import { UserRole } from '@/types/IUser';
import { connectToDB } from '@/utils/dbConnect';

import { generateRandomPassword, serializeDoc } from '../lib';
import { sendUserCredentialsEmail } from './sendNodeMailer';

export async function addUser(
  values: Partial<IUser>
): Promise<{ success: boolean; message: string; user: IUser }> {
  try {
    await connectToDB();

    const email = values.email?.trim();
    const phone = values.phone?.trim();

    // 1️⃣ Проверяем, есть ли пользователь по email или телефону
    let existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return {
        success: true,
        message: 'Користувач вже існує',
        user: serializeDoc<IUser>(existingUser),
      };
    }

    // 2️⃣ Генерируем временный пароль
    const tempPassword = generateRandomPassword();

    // 3️⃣ Создаём нового пользователя
    const newUser = new User({
      name: values.name,
      surname: values.surname,
      email,
      phone,
      role: UserRole.CUSTOMER,
      isActive: true,
      password: bcrypt.hashSync(tempPassword, bcrypt.genSaltSync(10)),
    });

    await newUser.save();

    // 4️⃣ Отправляем данные учетной записи пользователю
    await sendUserCredentialsEmail({
      email: newUser.email!,
      name: newUser.name!,
      login: newUser.email!,
      password: tempPassword,
    });

    return {
      success: true,
      message:
        'Користувача успішно створено! Дані для входу відправлені на email.',
      user: serializeDoc<IUser>(newUser),
    };
  } catch (error: any) {
    console.error('Error adding user:', error);
    throw new Error(
      'Failed to add user: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

// Функция для клиента

// export async function getAllUsers(searchParams: ISearchParams) {
//   const currentPage = Number(searchParams.page) || 1;

//   const { skip, limit } = buildPagination(searchParams, currentPage);
//   const filter = await buildFilter(searchParams);
//   const sortOption = buildSort(searchParams);

//   try {
//     await connectToDB();
//     const count = await User.countDocuments();

//     const users: IUser[] = await User.find(filter)
//       .sort(sortOption)
//       .limit(limit)
//       .skip(skip);
//     return {
//       success: true,
//       users: JSON.parse(JSON.stringify(users)),
//       count: count,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Error getting users:', error);
//       throw new Error('Failed to get users: ' + error.message);
//     } else {
//       console.error('Unknown error:', error);
//       throw new Error('Failed to get users: Unknown error');
//     }
//   }
// }

// export async function getUserById(id: string) {
//   try {
//     await connectToDB();
//     const user = await User.findById({ _id: id });
//     return JSON.parse(JSON.stringify(user));
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function deleteUser(id: string) {
//   if (!id) {
//     console.error('No ID provided');
//     return;
//   }
//   try {
//     await connectToDB();
//     await User.findByIdAndDelete(id);
//   } catch (error) {
//     console.log(error);
//   }
//   revalidatePath('/admin/users');
// }

// export async function updateUser(
//   values: any
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     await connectToDB();

//     const updateFields = Object.fromEntries(
//       Object.entries(values).filter(
//         ([key, value]) => key !== '_id' && value !== undefined
//       )
//     );

//     if (Object.keys(updateFields).length === 0) {
//       return {
//         success: false,
//         message: 'No valid fields to update.',
//       };
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       values._id,
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return {
//         success: false,
//         message: 'User not found.',
//       };
//     }

//     return {
//       success: true,
//       message: 'Користувача оновлено успішно',
//     };
//   } catch (error) {
//     console.error('Error update user:', error);
//     throw new Error('Failed to update user');
//   } finally {
//     revalidatePath('/admin/users');
//     redirect('/admin/users');
//   }
// }
