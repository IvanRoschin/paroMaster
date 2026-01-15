'use server';

import { revalidatePath } from 'next/cache';

import {
  addBrandService,
  deleteBrandService,
  getAllBrandsService,
  getBrandByIdService,
  updateBrandService,
} from '@/app/services/brandService';
import { IBrand, ISearchParams } from '@/types';

// add brand
export async function addBrandAction(values: Partial<IBrand>) {
  const result = await addBrandService(values);
  revalidatePath('/admin/brands');
  return result;
}

// get all brands
export async function getAllBrandsAction(searchParams: ISearchParams = {}) {
  return getAllBrandsService(searchParams);
}

// get brand by id
export async function getBrandByIdAction(id: string) {
  return getBrandByIdService(id);
}

// delete brand
export async function deleteBrandAction(id: string) {
  const result = await deleteBrandService(id);
  revalidatePath('/admin/brands');
  return result;
}

// update brand
export async function updateBrandAction(id: string, values: Partial<IBrand>) {
  const result = await updateBrandService(id, values);
  revalidatePath('/admin/brands');
  return result;
}
// 'use server';

// import { revalidatePath } from 'next/cache';

// import { buildPagination } from '@/helpers/index';
// import Brand from '@/models/Brand';
// import { IBrand, ISearchParams } from '@/types/index';
// import { connectToDB } from '@/utils/dbConnect';

// export interface IGetAllBrands {
//   success: boolean;
//   brands: IBrand[];
//   count: number;
// }

// export async function addBrand(formData: FormData) {
//   const values: Record<string, any> = {};
//   formData.forEach((value, key) => {
//     if (!values[key]) values[key] = [];
//     values[key].push(value);
//   });
//   Object.keys(values).forEach(key => {
//     if (values[key].length === 1) values[key] = values[key][0];
//   });

//   try {
//     await connectToDB();
//     const name = values.name;
//     const existingBrand = await Brand.findOne({ name });
//     if (existingBrand) {
//       throw new Error(`Бренд з таким ім'ям вже існує`);
//     }
//     await Brand.create(values);
//     return {
//       success: true,
//       message: 'Новий бренд додано',
//     };
//   } catch (error) {
//     console.error('Помилка додавання бренду:', error);
//     return {
//       success: false,
//       message: 'Помилка додавання бренду',
//     };
//   } finally {
//     revalidatePath('/admin/brands');
//   }
// }

// export async function getAllBrands(
//   searchParams?: ISearchParams
// ): Promise<IGetAllBrands> {
//   try {
//     await connectToDB();

//     const count = await Brand.countDocuments();

//     const query = Brand.find();

//     if (searchParams?.page) {
//       const currentPage = Number(searchParams.page) || 1;
//       const { skip, limit } = buildPagination(searchParams, currentPage);
//       query.skip(skip).limit(limit);
//     }

//     const brands: IBrand[] = await query.exec();

//     return {
//       success: true,
//       brands: JSON.parse(JSON.stringify(brands)),
//       count,
//     };
//   } catch (error) {
//     console.log(error);
//     return { success: false, brands: [], count: 0 };
//   }
// }

// export async function getBrandById(id: string) {
//   if (!id) throw new Error('ID бренду не переданий');
//   try {
//     await connectToDB();
//     const brand = await Brand.findById({ _id: id });
//     return JSON.parse(JSON.stringify(brand));
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Помилка отримання бренду:', error);
//       throw new Error('Помилка отримання бренду: ' + error.message);
//     } else {
//       console.error('Unknown error:', error);
//       throw new Error('Помилка отримання бренду: Не відома помилка');
//     }
//   }
// }

// export async function deleteBrand(id: string): Promise<void> {
//   if (!id) return;
//   await connectToDB();
//   await Brand.findByIdAndDelete(id);
// }

// export async function updateBrand(formData: FormData) {
//   const entries = Object.fromEntries(formData.entries());
//   const { id, name, slug, src, country, website } = entries as {
//     id: string;
//     name?: string;
//     slug?: string;
//     src?: string;
//     country?: string;
//     website?: string;
//   };
//   try {
//     await connectToDB();
//     const updateFields: Partial<IBrand> = {
//       name,
//       slug,
//       src,
//       country,
//       website,
//     };
//     Object.keys(updateFields).forEach(
//       key =>
//         (updateFields[key as keyof IBrand] === '' ||
//           updateFields[key as keyof IBrand] === undefined) &&
//         delete updateFields[key as keyof IBrand]
//     );
//     await Brand.findByIdAndUpdate(id, updateFields);
//     return {
//       success: true,
//       message: 'Бренд оновлено успішно',
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Помилка оновлення бренду:', error);
//       throw new Error('Помилка оновлення бренду: ' + error.message);
//     } else {
//       console.error('Невідома помилка бренду:', error);
//       throw new Error('Помилка оновлення бренду: Невідома помилка');
//     }
//   } finally {
//     revalidatePath('/admin/brands');
//   }
// }
