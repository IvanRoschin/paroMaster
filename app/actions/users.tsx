'use server';

import mongoose from 'mongoose';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import Token, { TokenType } from '@/models/Token';
import User from '@/models/User';
import { IUser } from '@/types/index';
import { UserRole } from '@/types/IUser';
import { connectToDB } from '@/utils/dbConnect';

import { generateRandomPassword, serializeDoc } from '../lib';
import { sendVerificationLetter } from './sendNodeMailer';

export async function addUser(values: Partial<IUser>): Promise<{
  success: boolean;
  message: string;
  user: IUser;
}> {
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

    // 3️⃣ Создаём нового пользователя
    const newUser = new User({
      name: values.name,
      surname: values.surname,
      email,
      phone,
      role: UserRole.CUSTOMER,
      isActive: false,
    });

    await newUser.save();

    const verificationToken = await Token.create({
      userId: newUser._id,
      token: generateRandomPassword(32),
      type: TokenType.VERIFICATION,
      used: false,
    });

    await sendVerificationLetter({
      email: newUser.email!,
      name: newUser.name!,
      token: verificationToken.token,
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

export async function getAllUsers(): Promise<{
  success: boolean;
  users: IUser[];
  count: number;
}> {
  try {
    await connectToDB();

    const users = await User.find({});
    const count = await User.countDocuments();

    return {
      success: true,
      users: users.map(u => serializeDoc<IUser>(u)),
      count,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(
      'Failed to fetch users: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

export async function getUserById(id: string): Promise<IUser | null> {
  if (!id) throw new Error('No ID provided');

  try {
    await connectToDB();
    const user = await User.findById(id);
    return user ? serializeDoc<IUser>(user) : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error(
      'Failed to fetch user: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

export async function updateUser(
  values: Partial<IUser> & { _id: string }
): Promise<{
  success: boolean;
  message: string;
  user?: IUser;
}> {
  if (!values._id) throw new Error('No ID provided');

  try {
    await connectToDB();

    // Убираем _id из обновляемых полей
    const updateFields = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => key !== '_id' && value !== undefined
      )
    );

    if (Object.keys(updateFields).length === 0) {
      return { success: false, message: 'No valid fields to update.' };
    }

    const updatedUser = await User.findByIdAndUpdate(
      values._id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: 'User not found.' };
    }

    return {
      success: true,
      message: 'User updated successfully',
      user: serializeDoc<IUser>(updatedUser),
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(
      'Failed to update user: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

export async function deleteUser(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: 'No ID provided' };

  await connectToDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Удаляем токены
    await Token.deleteMany({ id }).session(session);

    // 2️⃣ Находим Customer
    const customer = await Customer.findOne({ user: id }).session(session);

    if (customer) {
      // 3️⃣ Обновляем заказы
      await Order.updateMany(
        { customer: customer._id },
        { $set: { customer: null, customerDeleted: true } }
      ).session(session);

      // 4️⃣ Удаляем Customer
      await Customer.deleteOne({ _id: customer._id }).session(session);
    }

    // 5️⃣ Удаляем User
    await User.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: 'User and related data deleted successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting user cascade:', error);
    throw new Error('Failed to delete user cascade');
  }
}
