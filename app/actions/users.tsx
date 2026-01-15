'use server';

import { revalidatePath } from 'next/cache';

import { IUser } from '@/types/index';

import {
  addUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  requestEmailChangeService,
  updateUserFieldService,
} from '../services/userService';

export async function addUserAction(values: Partial<IUser>): Promise<{
  success: boolean;
  message: string;
  user?: IUser;
}> {
  return addUserService(values);
}

export async function getAllUsersAction(): Promise<{
  success: boolean;
  users: IUser[];
  count: number;
}> {
  return getAllUsersService();
}

export async function getUserByIdAction(id: string): Promise<IUser | null> {
  return getUserByIdService(id);
}

export async function updateUserFieldAction(
  userId: string,
  field: 'name' | 'surname' | 'email' | 'phone',
  value: string
) {
  const res = await updateUserFieldService(userId, field, value);
  if (res.success) {
    revalidatePath('/profile');
  }
  return res;
}

export async function requestEmailChangeAction(
  userId: string,
  newEmail: string
) {
  return requestEmailChangeService(userId, newEmail);
}

export async function deleteUserAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  return deleteUserService(id);
}

// export async function addUser(values: Partial<IUser>): Promise<{
//   success: boolean;
//   message: string;
//   user: IUser;
// }> {
//   try {
//     await connectToDB();

//     const email = values.email?.trim();
//     const phone = values.phone?.trim();

//     // 1️⃣ Проверяем, есть ли пользователь по email или телефону
//     let existingUser = await User.findOne({ $or: [{ email }, { phone }] });

//     if (existingUser) {
//       return {
//         success: true,
//         message: 'Користувач вже існує',
//         user: serializeDoc<IUser>(existingUser),
//       };
//     }

//     // 3️⃣ Создаём нового пользователя
//     const newUser = new User({
//       name: values.name,
//       surname: values.surname,
//       email,
//       phone,
//       role: UserRole.CUSTOMER,
//       isActive: false,
//     });

//     await newUser.save();

//     const verificationToken = await Token.create({
//       userId: newUser._id,
//       token: generateRandomPassword(32),
//       type: TokenType.VERIFICATION,
//       used: false,
//     });

//     await sendVerificationLetter({
//       email: newUser.email!,
//       name: newUser.name!,
//       token: verificationToken.token,
//     });
//     return {
//       success: true,
//       message:
//         'Користувача успішно створено! Дані для входу відправлені на email.',
//       user: serializeDoc<IUser>(newUser),
//     };
//   } catch (error: any) {
//     console.error('Error adding user:', error);
//     throw new Error(
//       'Failed to add user: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function getAllUsers(): Promise<{
//   success: boolean;
//   users: IUser[];
//   count: number;
// }> {
//   try {
//     await connectToDB();

//     const users = await User.find({});
//     const count = await User.countDocuments();

//     return {
//       success: true,
//       users: users.map(u => serializeDoc<IUser>(u)),
//       count,
//     };
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw new Error(
//       'Failed to fetch users: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function getUserById(id: string): Promise<IUser | null> {
//   if (!id) throw new Error('No ID provided');

//   try {
//     await connectToDB();
//     const user = await User.findById(id);
//     return user ? toPlain<IUser>(user) : null;
//   } catch (error) {
//     console.error('Error fetching user by ID:', error);
//     throw new Error(
//       'Failed to fetch user: ' +
//         (error instanceof Error ? error.message : 'Unknown error')
//     );
//   }
// }

// export async function updateUserFieldAction(
//   userId: string,
//   field: 'name' | 'surname' | 'email' | 'phone',
//   value: string
// ) {
//   try {
//     if (!userId) {
//       return { success: false, message: 'Користувач не авторизований' };
//     }

//     await connectToDB();

//     const user = await User.findById(userId);
//     if (!user) return { success: false, message: 'Користувача не знайдено' };

//     // Проверяем уникальность email
//     if (field === 'email') {
//       const existing = await User.findOne({ email: value });
//       if (existing && existing._id.toString() !== userId) {
//         return {
//           success: false,
//           message: 'Цей email вже використовується іншим користувачем',
//         };
//       }
//     }

//     user[field] = value;
//     await user.save();

//     // Возвращаем актуальные данные пользователя
//     const updatedUser: IUser = toPlain(user);

//     return {
//       success: true,
//       message: 'Дані успішно оновлено',
//       user: updatedUser,
//     };
//   } catch (e: any) {
//     console.error('updateUserFieldAction:', e);
//     return { success: false, message: e.message || 'Помилка сервера' };
//   }
// }

// export async function requestEmailChange(userId: string, newEmail: string) {
//   await connectToDB();

//   const user = await User.findById(userId);
//   if (!user) return { success: false, message: 'Користувача не знайдено' };

//   const existing = await User.findOne({ email: newEmail });
//   if (existing)
//     return { success: false, message: 'Цей email вже використовується' };

//   // revoke previous email change tokens for this user
//   await Token.updateMany(
//     { userId, type: TokenType.EMAIL_CHANGE },
//     { used: true }
//   );

//   const tokenDoc = await createTokenForUser({
//     userId,
//     type: TokenType.EMAIL_CHANGE,
//     email: newEmail,
//   });

//   await sendEmailChangeLetter({ newEmail, token: tokenDoc.token });

//   return {
//     success: true,
//     message:
//       'На новий email відправлено лист з підтвердженням. Перевірте пошту.',
//   };
// }

// export async function deleteUser(
//   id: string
// ): Promise<{ success: boolean; message: string }> {
//   if (!id) return { success: false, message: 'No ID provided' };

//   await connectToDB();

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1️⃣ Удаляем токены
//     await Token.deleteMany({ id }).session(session);

//     // 2️⃣ Находим Customer
//     const customer = await Customer.findOne({ user: id }).session(session);

//     if (customer) {
//       // 3️⃣ Обновляем заказы
//       await Order.updateMany(
//         { customer: customer._id },
//         { $set: { customer: null, customerDeleted: true } }
//       ).session(session);

//       // 4️⃣ Удаляем Customer
//       await Customer.deleteOne({ _id: customer._id }).session(session);
//     }

//     // 5️⃣ Удаляем User
//     await User.deleteOne({ _id: id }).session(session);

//     await session.commitTransaction();
//     session.endSession();

//     return {
//       success: true,
//       message: 'User and related data deleted successfully',
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Error deleting user cascade:', error);
//     throw new Error('Failed to delete user cascade');
//   }
// }
