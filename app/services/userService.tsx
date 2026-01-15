'use server';

import mongoose from 'mongoose';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import Token, { TokenType } from '@/models/Token';
import User from '@/models/User';
import { IUser } from '@/types';
import { UserRole } from '@/types/IUser';
import { connectToDB } from '@/utils/dbConnect';

import { serializeForClient } from '../helpers/server/serializeForClient';
import toPlain from '../helpers/server/toPlain';
import { generateRandomPassword, serializeDoc } from '../lib';
import {
  sendEmailChangeLetter,
  sendVerificationLetter,
} from './sendNodeMailer';
import { createTokenService as createTokenForUser } from './tokenService';

export async function addUserService(values: Partial<IUser>): Promise<{
  success: boolean;
  message: string;
  user?: IUser;
}> {
  await connectToDB();

  const email = values.email?.trim();
  const phone = values.phone?.trim();

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return {
      success: true,
      message: 'Користувач вже існує',
      user: serializeForClient(existingUser),
    };
  }

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
}

export async function getAllUsersService(): Promise<{
  success: boolean;
  users: IUser[];
  count: number;
}> {
  await connectToDB();

  const users = await User.find({});
  const count = await User.countDocuments();

  return {
    success: true,
    users: users.map(u => serializeDoc<IUser>(u)),
    count,
  };
}

export async function getUserByIdService(id: string): Promise<IUser | null> {
  if (!id) return null;
  await connectToDB();

  const user = await User.findById(id);
  return user ? toPlain<IUser>(user) : null;
}

export async function updateUserFieldService(
  userId: string,
  field: 'name' | 'surname' | 'email' | 'phone',
  value: string
) {
  if (!userId)
    return { success: false, message: 'Користувач не авторизований' };
  await connectToDB();

  const user = await User.findById(userId);
  if (!user) return { success: false, message: 'Користувача не знайдено' };

  if (field === 'email') {
    const existing = await User.findOne({ email: value });
    if (existing && existing._id.toString() !== userId) {
      return {
        success: false,
        message: 'Цей email вже використовується іншим користувачем',
      };
    }
  }

  user[field] = value;
  await user.save();

  return {
    success: true,
    message: 'Дані успішно оновлено',
    user: {
      _id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

export async function requestEmailChangeService(
  userId: string,
  newEmail: string
) {
  await connectToDB();

  const user = await User.findById(userId);
  if (!user) return { success: false, message: 'Користувача не знайдено' };

  const existing = await User.findOne({ email: newEmail });
  if (existing)
    return { success: false, message: 'Цей email вже використовується' };

  await Token.updateMany(
    { userId, type: TokenType.EMAIL_CHANGE },
    { used: true }
  );

  const tokenDoc = await createTokenForUser({
    userId,
    type: TokenType.EMAIL_CHANGE,
    email: newEmail,
  });
  await sendEmailChangeLetter({ newEmail, token: tokenDoc.token });

  return {
    success: true,
    message:
      'На новий email відправлено лист з підтвердженням. Перевірте пошту.',
  };
}

export async function updateUserService(id: string, values: Partial<IUser>) {
  await connectToDB();

  const updateFields = { ...values };

  // Удаляем пустые поля
  Object.keys(updateFields).forEach(key => {
    const typedKey = key as keyof IUser;
    const val = updateFields[typedKey];

    if (val === '' || val === undefined) {
      delete updateFields[typedKey];
    }
  });

  const doc = await Customer.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  return {
    success: true,
    message: 'Дані користувача оновлено',
    customer: serializeForClient(doc),
  };
}

export async function deleteUserService(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: 'No ID provided' };

  await connectToDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Token.deleteMany({ userId: id }).session(session);

    const customer = await Customer.findOne({ user: id }).session(session);

    if (customer) {
      await Order.updateMany(
        { customer: customer._id },
        { $set: { customer: null, customerDeleted: true } }
      ).session(session);
      await Customer.deleteOne({ _id: customer._id }).session(session);
    }

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
    return { success: false, message: 'Failed to delete user cascade' };
  }
}
