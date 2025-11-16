'use server';

import { buildPagination } from '@/helpers/index';
import Brand from '@/models/Brand';
import { IBrand, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export async function addBrandService(values: Partial<IBrand>) {
  await connectToDB();

  const existingBrand = await Brand.findOne({ name: values.name });
  if (existingBrand)
    return { success: false, message: `Бренд з таким ім'ям вже існує` };

  await Brand.create(values);

  return { success: true, message: 'Новий бренд додано' };
}

export async function getAllBrandsService(searchParams: ISearchParams = {}) {
  await connectToDB();

  const count = await Brand.countDocuments();

  const query = Brand.find();

  if (searchParams.page) {
    const currentPage = Number(searchParams.page) || 1;
    const { skip, limit } = buildPagination(searchParams, currentPage);
    query.skip(skip).limit(limit);
  }

  const brands = await query.exec();

  return {
    success: true,
    brands: JSON.parse(JSON.stringify(brands)),
    count,
  };
}

export async function getBrandByIdService(id: string) {
  if (!id) return null;

  await connectToDB();

  const brand = await Brand.findById(id);
  return JSON.parse(JSON.stringify(brand));
}

export async function deleteBrandService(id: string) {
  if (!id) return { success: false, message: 'ID не передано' };

  await connectToDB();
  await Brand.findByIdAndDelete(id);

  return { success: true, message: 'Бренд видалено' };
}

export async function updateBrandService(id: string, values: Partial<IBrand>) {
  await connectToDB();

  const updateFields = { ...values };

  Object.keys(updateFields).forEach(key => {
    const typedKey = key as keyof IBrand;
    const val = updateFields[typedKey];

    if (val === '' || val === undefined) {
      delete updateFields[typedKey];
    }
  });

  await Brand.findByIdAndUpdate(id, updateFields);

  return { success: true, message: 'Бренд оновлено успішно' };
}
