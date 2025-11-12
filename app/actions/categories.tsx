'use server';

import { revalidatePath } from 'next/cache';

import { buildPagination } from '@/helpers/index';
import { slugify } from '@/lib/slugify';
import Category from '@/models/Category';
import { ICategory, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

import toPlain from '../helpers/server/toPlain';

export interface IGetAllCategories {
  success: boolean;
  categories: ICategory[];
  count: number;
}

export interface ICategorySerialized {
  _id: string;
  slug: string;
  name: string;
  src?: string;
}

export async function addCategory(formData: FormData) {
  const values: Record<string, any> = Object.fromEntries(formData.entries());
  try {
    await connectToDB();

    // Генерируем slug на сервере
    if (!values.name) throw new Error(`Назва категорії обов'язкова`);
    values.slug = slugify(values.name);

    const existingCategory = await Category.findOne({ slug: values.slug });
    if (existingCategory) throw new Error('Категорія з такою назвою вже існує');

    await Category.create(values);
    revalidatePath('/admin/categories');

    return { success: true, message: 'Категорію додано успішно' };
  } catch (error) {
    console.error('Помилка додавання категорії:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Помилка додавання категорії',
    };
  }
}

export async function getAllCategories(
  searchParams?: ISearchParams
): Promise<IGetAllCategories> {
  try {
    await connectToDB();

    const count = await Category.countDocuments();

    const query = Category.find();

    if (searchParams?.page) {
      const currentPage = Number(searchParams.page) || 1;
      const { skip, limit } = buildPagination(searchParams, currentPage);
      query.skip(skip).limit(limit);
    }

    const categories: ICategory[] = await query.exec();

    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
      count,
    };
  } catch (error) {
    console.log(error);
    return { success: false, categories: [], count: 0 };
  }
}

export async function getCategoryById(id: string) {
  if (!id) throw new Error('ID категорії не переданий');
  try {
    await connectToDB();
    const category = await Category.findById({ _id: id });
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Помилка отримання категорії:', error);
      throw new Error('Помилка отримання категорії: ' + error.message);
    } else {
      console.error('Не відома помилка:', error);
      throw new Error('Помилка отримання категорії: Не відома помилка');
    }
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!id) return;
  await connectToDB();
  await Category.findByIdAndDelete(id);
}

export async function updateCategory(formData: FormData) {
  const values: Record<string, any> = Object.fromEntries(formData.entries());
  const { id, name, src } = values as {
    id: string;
    name?: string;
    src?: string;
  };

  if (!id) throw new Error('Category id is required');

  try {
    await connectToDB();
    const updateFields: Partial<ICategory> = { name, src };

    // Удаляем пустые поля
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof ICategory] === '' ||
          updateFields[key as keyof ICategory] === undefined) &&
        delete updateFields[key as keyof ICategory]
    );

    // Генерируем slug при обновлении
    if (name) updateFields.slug = slugify(name);

    await Category.findByIdAndUpdate(id, updateFields);
    revalidatePath('/admin/categories');

    return { success: true, message: 'Category updated successfully' };
  } catch (error) {
    console.error('Error updating Category:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Error updating Category',
    };
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<ICategorySerialized | null> {
  await connectToDB();

  const categoryDoc = await Category.findOne({ slug }).lean();
  if (!categoryDoc) return null;

  // Сериализация и приведение _id к строке
  const category: ICategorySerialized = toPlain(categoryDoc);

  return category;
}
