// 'use server';

// import crypto from 'crypto';

// import { sendMail, serializeDoc } from '@/app/lib';
// import Token, { TokenType } from '@/models/Token';
// import User from '@/models/User';
// import { IUser } from '@/types/IUser';
// import { connectToDB } from '@/utils/dbConnect';

// import { routes } from '../helpers/routes';

// export function generateRandomPassword(length = 10) {
//   return crypto.randomBytes(length).toString('base64').slice(0, length);
// }

// export async function verifyUser(tokenValue: string) {
//   try {
//     if (!tokenValue) return { success: false, message: 'Токен не переданий' };
//     await connectToDB();

//     // 1️⃣ Ищем токен БЕЗ фильтра по типу
//     const tokenDoc = await Token.findOne({
//       token: tokenValue,
//       used: false,
//     });

//     if (!tokenDoc)
//       return { success: false, message: 'Невірний або використаний токен' };

//     // 1) Проверяем срок действия
//     if (tokenDoc.expiresAt && tokenDoc.expiresAt < new Date()) {
//       tokenDoc.used = true;
//       await tokenDoc.save();
//       return { success: false, message: 'Термін дії токена минув' };
//     }

//     const user = await User.findById(tokenDoc.userId);
//     if (!user) return { success: false, message: 'Користувача не знайдено' };

//     // -------------------------------
//     // 🔥 2️⃣ ОБРАБОТКА СМЕНЫ ЕМЕЙЛА
//     // -------------------------------
//     if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
//       if (!tokenDoc.email) {
//         return {
//           success: false,
//           message: 'Помилка: email не знайдено в токені',
//         };
//       }

//       user.email = tokenDoc.email; // 👈 применяем новый email
//       await user.save();

//       tokenDoc.used = true;
//       await tokenDoc.save();

//       return {
//         success: true,
//         message: 'Email успішно змінено!',
//         user: serializeDoc<IUser>(user),
//       };
//     }

//     // -------------------------------
//     // 🔥 3️⃣ АКТИВАЦИЯ АККАУНТА
//     // -------------------------------
//     if (tokenDoc.type === TokenType.VERIFICATION) {
//       if (user.isActive) {
//         return {
//           success: false,
//           message: 'Обліковий запис вже активовано',
//         };
//       }

//       const tempPassword = generateRandomPassword();
//       user.setPassword(tempPassword);
//       user.isActive = true;
//       await user.save();

//       tokenDoc.used = true;
//       await tokenDoc.save();

//       const resetPasswordUrl = `${process.env.NEXT_PUBLIC_PUBLIC_URL}${routes.publicRoutes.auth.signIn}`;

//       const emailContent = `
//         <div style="max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;font-family:Arial,sans-serif;color:#333;">
//           <h2>Привіт, ${user.name}!</h2>
//           <p>Ваш обліковий запис активовано на сайті магазину запчастин <strong>ParoMaster</strong>.</p>
//           <p><strong>Логін:</strong> ${user.email}</p>
//           <p><strong>Пароль:</strong> ${tempPassword}</p>
//           <p>Радимо змінити пароль після першого входу.</p>
//         </div>
//       `;

//       await sendMail({
//         to: user.email!,
//         from: {
//           email: 'no-reply@paromaster.com',
//           name: 'Магазин запчастин ParoMaster',
//         },
//         subject: 'Ваші дані для входу на ParoMaster',
//         body: emailContent,
//       });

//       return {
//         success: true,
//         message: 'Кабінет активовано. Дані для входу відправлено на email.',
//         user: serializeDoc<IUser>(user),
//       };
//     }

//     // -------------------------------
//     // ❌ НЕИЗВЕСТНЫЙ ТИП ТОКЕНА
//     // -------------------------------
//     return {
//       success: false,
//       message: 'Невідомий тип токена',
//     };
//   } catch (error: any) {
//     console.error('verifyUser error:', error);
//     return { success: false, message: error.message || 'Невідома помилка' };
//   }
// }

// export async function sendPasswordResetEmailAction(email: string) {
//   await connectToDB();

//   // 1️⃣ Находим юзера
//   const user = await User.findOne({ email });
//   if (!user) {
//     // чтобы не раскрывать кто есть, а кто нет
//     return {
//       success: true,
//       message: 'Якщо користувач існує — на email надіслано посилання',
//     };
//   }

//   // 2️⃣ Удаляем старые tokены PASSWORD_RESET (опционально, но правильно)
//   await Token.deleteMany({ userId: user._id, type: TokenType.PASSWORD_RESET });

//   // 3️⃣ Генерируем токен
//   const rawToken = crypto.randomUUID();
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(rawToken)
//     .digest('hex');

//   // 4️⃣ Создаем токен с TTL 1 час
//   await Token.create({
//     userId: user._id,
//     token: hashedToken,
//     type: TokenType.PASSWORD_RESET,
//     used: false,
//     createdAt: new Date(),
//   });

//   // 5️⃣ Линку на смену пароля

//   const resetUrl = `${process.env.NEXT_PUBLIC_PUBLIC_URL}${routes.publicRoutes.auth.restorePassword}?token=${rawToken}`;

//   // 6️⃣ HTML тело письма
//   const emailContent = `
//   <div style="max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;font-family:Arial,sans-serif;color:#333;">
//     <h2>Привіт, ${user.name}!</h2>

//     <p>Ви направили запит на зміну паролю до особистого кабінету на сайті <strong>ParoMaster</strong>.</p>

//     <p>
//       Щоб змінити пароль, перейдіть за посиланням:<br>
//       <a href="${resetUrl}" style="color:#2196F3;text-decoration:none;">Змінити пароль</a>
//     </p>

//     <p>Посилання дійсне протягом <strong>1 години</strong>.</p>

//     <p>Якщо Ви не подавали такий запит — просто проігноруйте це повідомлення.</p>

//     <p>З повагою, команда ParoMaster 🚀</p>
//   </div>
// `;

//   // 7️⃣ Отправка
//   await sendMail({
//     to: user.email!,
//     from: {
//       email: 'no-reply@paromaster.com',
//       name: 'Магазин запчастин ParoMaster',
//     },
//     subject: 'Зміна паролю для входу на ParoMaster',
//     body: emailContent,
//   });

//   return {
//     success: true,
//     message: 'Посилання для відновлення пароля надіслано',
//   };
// }

// export async function resetPasswordAction(
//   token: string,
//   password: string,
//   confirmPassword: string
// ) {
//   if (password !== confirmPassword) {
//     return { success: false, message: 'Паролі не співпадають' };
//   }

//   await connectToDB();

//   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//   const tokenDoc = await Token.findOne({
//     token: hashedToken,
//     type: TokenType.PASSWORD_RESET,
//     used: false,
//   });

//   if (!tokenDoc) {
//     return { success: false, message: 'Невірний або прострочений токен' };
//   }

//   const user = await User.findById(tokenDoc.userId);
//   if (!user) {
//     return { success: false, message: 'Користувача не знайдено' };
//   }

//   user.setPassword(password);
//   await user.save();

//   tokenDoc.used = true;
//   await tokenDoc.save();

//   return { success: true, message: 'Пароль успішно змінено' };
// }

// export async function changePasswordAction(
//   userId: string,
//   oldPassword: string,
//   newPassword: string,
//   confirmPassword: string
// ) {
//   if (newPassword !== confirmPassword) {
//     return { success: false, message: 'Паролі не співпадають' };
//   }

//   await connectToDB();

//   if (!userId) {
//     return { success: false, message: 'Необхідно увійти в акаунт' };
//   }

//   const user = await User.findById(userId);

//   if (!user) {
//     return { success: false, message: 'Користувача не знайдено' };
//   }

//   // ✔ Используем метод модели
//   const isMatch = user.comparePassword(oldPassword);
//   if (!isMatch) {
//     return { success: false, message: 'Неправильний поточний пароль' };
//   }

//   // ✔ Меняем пароль через метод модели
//   user.setPassword(newPassword);
//   await user.save();

//   return { success: true, message: 'Пароль успішно змінено' };
// }
