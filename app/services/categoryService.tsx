'use server';

import { buildPagination } from '@/helpers/index';
import toPlain from '@/helpers/server/toPlain';
import { slugify } from '@/lib/slugify';
import Category from '@/models/Category';
import { ICategory, ISearchParams } from '@/types';
import { connectToDB } from '@/utils/dbConnect';

export async function addCategoryService(values: Partial<ICategory>) {
  await connectToDB();

  if (!values.name) {
    return { success: false, message: `Назва категорії обов'язкова` };
  }

  const slug = slugify(values.name);

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    return { success: false, message: 'Категорія з такою назвою вже існує' };
  }

  await Category.create({ ...values, slug });

  return { success: true, message: 'Категорію додано успішно' };
}

export async function getAllCategoriesService(
  searchParams: ISearchParams = {}
) {
  await connectToDB();

  const count = await Category.countDocuments();

  const query = Category.find();

  if (searchParams.page) {
    const currentPage = Number(searchParams.page) || 1;
    const { skip, limit } = buildPagination(searchParams, currentPage);
    query.skip(skip).limit(limit);
  }

  const categories = await query.exec();

  return {
    success: true,
    categories: JSON.parse(JSON.stringify(categories)),
    count,
  };
}

export async function getCategoryByIdService(id: string) {
  if (!id) return null;

  await connectToDB();
  const category = await Category.findById(id);

  return JSON.parse(JSON.stringify(category));
}

export async function deleteCategoryService(id: string) {
  if (!id) return { success: false, message: 'ID не передано' };

  await connectToDB();
  await Category.findByIdAndDelete(id);

  return { success: true, message: 'Категорія видалена' };
}

export async function updateCategoryService(
  id: string,
  values: Partial<ICategory>
) {
  await connectToDB();

  const updateFields = { ...values };

  // очистка пустых полей
  Object.keys(updateFields).forEach(key => {
    const typedKey = key as keyof ICategory;
    const val = updateFields[typedKey];

    if (val === '' || val === undefined) {
      delete updateFields[typedKey];
    }
  });

  if (updateFields.name) {
    updateFields.slug = slugify(updateFields.name);
  }

  await Category.findByIdAndUpdate(id, updateFields);

  return { success: true, message: 'Категорію оновлено успішно' };
}

export async function getCategoryBySlugService(slug: string) {
  await connectToDB();

  const doc = await Category.findOne({ slug }).lean();
  if (!doc) return null;

  return toPlain(doc);
}
