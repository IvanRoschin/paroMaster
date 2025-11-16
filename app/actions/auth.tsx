// 'use server';

import {
  changePasswordService,
  resetPasswordService,
  sendPasswordResetEmailService,
  verifyUserService,
} from '@/app/services/authService';

export async function verifyUserAction(token: string) {
  return verifyUserService(token);
}

export async function sendPasswordResetEmailAction(email: string) {
  return sendPasswordResetEmailService(email);
}

export async function resetPasswordAction(
  token: string,
  password: string,
  confirmPassword: string
) {
  return resetPasswordService(token, password, confirmPassword);
}

export async function changePasswordAction(
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  return changePasswordService(
    userId,
    oldPassword,
    newPassword,
    confirmPassword
  );
}
