'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { buildFilter, buildPagination, buildSort } from '@/helpers/index';
import { Good } from '@/models/index';
import Testimonial from '@/models/Testimonial';
import { IBrand, IGood, ISearchParams } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export interface IGetAllGoods {
  success: boolean;
  goods: IGood[];
  count: number;
}

export interface IGetAllBrands {
  success: boolean;
  brands: IBrand[];
  count: number;
}

export interface IGetPrices {
  success: boolean;
  minPrice: number;
  maxPrice: number;
}
export async function getAllGoods(
  searchParams: ISearchParams
): Promise<IGetAllGoods> {
  const filter = buildFilter(searchParams);
  const sortOption = buildSort(searchParams);
  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);
  try {
    await connectToDB();

    const count = await Good.countDocuments(filter);

    const goods: IGood[] = await Good.find(filter)
      .populate('category', 'title')
      .populate('brand', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    const serializedGoods = JSON.parse(JSON.stringify(goods)).map((g: any) => ({
      ...g,
      category: g.category?.title || '',
      brand: g.brand?.name || '',
    }));

    return {
      success: true,
      goods: serializedGoods,
      count,
    };
  } catch (error) {
    console.error('Error fetching goods:', error);
    return { success: false, goods: [], count: 0 };
  }
}

export async function getGoodById(id: string) {
  try {
    await connectToDB();
    const good = await Good.findById({ _id: id })
      .populate('category', 'title')
      .populate('brand', 'name');

    if (!good) return null;

    const testimonials = await Testimonial.find({
      product: id,
      isActive: true,
    }).sort({ createdAt: -1 });

    const compatibleGoods = await Good.find({
      isCompatible: true,
      compatibility: { $regex: good.model, $options: 'i' },
    });

    return JSON.parse(
      JSON.stringify({
        ...good.toObject(),
        category: good.category?.title ?? '',
        brand: good.brand?.name ?? '',
        testimonials,
        compatibleGoods,
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export async function addGood(formData: FormData) {
  const values: Record<string, any> = {};

  // Преобразуем FormData в объект
  formData.forEach((value, key) => {
    // Обрабатываем массивы с "[]"
    if (key.endsWith('[]')) {
      const cleanKey = key.replace('[]', '');
      if (!values[cleanKey]) values[cleanKey] = [];
      values[cleanKey].push(value);
    } else {
      values[key] = value;
    }
  });

  // Преобразуем price в число
  values.price = Number(values.price);
  if (isNaN(values.price)) {
    return { success: false, message: 'Invalid price' };
  }

  // Проверка обязательных полей
  const requiredFields = [
    'category',
    'title',
    'brand',
    'model',
    'vendor',
    'price',
    'description',
    'src',
  ];
  for (const field of requiredFields) {
    if (
      !values[field] ||
      (Array.isArray(values[field]) && values[field].length === 0)
    ) {
      console.log('Missing field:', field, values[field]);
      return { success: false, message: `Missing required field: ${field}` };
    }
  }

  try {
    await connectToDB();

    const existingGood = await Good.findOne({ vendor: values.vendor });
    if (existingGood) {
      return {
        success: false,
        message: 'Good with this vendor already exists',
      };
    }

    await Good.create({
      category: values.category,
      title: values.title,
      brand:
        values.brand.charAt(0).toUpperCase() +
        values.brand.slice(1).toLowerCase(),
      model: values.model,
      price: values.price,
      description: values.description,
      src: Array.isArray(values.src) ? values.src : [values.src],
      vendor: values.vendor,
      isCondition: values.isCondition === 'true',
      isAvailable: values.isAvailable === 'true',
      isCompatible: values.isCompatible === 'true',
      compatibility: values.compatibility || [],
    });

    return { success: true, message: 'Good added successfully' };
  } catch (error) {
    console.error('Error adding good:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error adding good',
    };
  }
}

export async function deleteGood(id: string): Promise<void> {
  if (!id) return;
  await connectToDB();
  const deletedReviews = await Testimonial.deleteMany({ product: id });
  if (deletedReviews.deletedCount > 0) {
    console.log(
      `Видалено ${deletedReviews.deletedCount} відгуків для товару з ID: ${id}`
    );
  } else {
    console.log('Відгуків не було знайдено для видалення');
  }
  await Good.findByIdAndDelete(id);
}

export async function updateGood(formData: FormData) {
  const values: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (!values[key]) values[key] = [];
    values[key].push(value);
  });

  // упрощаем: если массив длиной 1, берем единственный элемент
  Object.keys(values).forEach(key => {
    if (values[key].length === 1) values[key] = values[key][0];
  });

  const {
    id,
    category,
    src,
    brand,
    model,
    vendor,
    title,
    description,
    price,
    isCondition,
    isAvailable,
    isCompatible,
    compatibility,
  } = values;

  try {
    await connectToDB();

    const updateFields: Partial<IGood> = {
      category: category
        ? new mongoose.Types.ObjectId(category).toString()
        : undefined,
      brand: brand ? new mongoose.Types.ObjectId(brand).toString() : undefined,
      src: Array.isArray(src) ? src : src ? [src] : [],
      model,
      vendor,
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      isCondition: isCondition === 'true',
      isAvailable: isAvailable === 'true',
      isCompatible: isCompatible === 'true',
      compatibility: Array.isArray(compatibility)
        ? compatibility
        : compatibility
          ? [compatibility]
          : [],
    };

    // удаляем поля с undefined или пустой строкой
    Object.keys(updateFields).forEach(
      key =>
        (updateFields[key as keyof IGood] === '' ||
          updateFields[key as keyof IGood] === undefined) &&
        delete updateFields[key as keyof IGood]
    );

    await Good.findByIdAndUpdate(id, updateFields);

    return {
      success: true,
      message: 'Good updated successfully',
    };
  } catch (error) {
    console.error('Error updating good:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getMostPopularGoods() {
  try {
    await connectToDB();
    const mostPopularGoods: IGood[] = await Good.find()
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(10);

    return {
      success: true,
      goods: JSON.parse(JSON.stringify(mostPopularGoods)),
    };
  } catch (error) {
    console.log('Error fetching most popular goods:', error);
    return { success: false, goods: [] };
  } finally {
    revalidatePath('/');
  }
}

export async function getMinMaxPrice(): Promise<{
  success: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  message?: string;
}> {
  try {
    // Connect to the database
    await connectToDB();

    // Perform the aggregation
    const result = await Good.aggregate([
      {
        $project: {
          price: {
            $cond: {
              if: { $isNumber: { $toDouble: '$price' } },
              then: { $toDouble: '$price' },
              else: null,
            },
          },
        },
      },
      {
        $match: {
          price: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $project: {
          _id: 0,
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ]).exec();

    // Check if results were found
    if (result.length === 0) {
      return {
        success: false,
        minPrice: null,
        maxPrice: null,
        message: 'No valid goods found',
      };
    }

    return {
      success: true,
      minPrice: result[0].minPrice,
      maxPrice: result[0].maxPrice,
    };
  } catch (error: any) {
    console.error('Error fetching min and max prices:', error);
    return {
      success: false,
      minPrice: null,
      maxPrice: null,
      message: error.message,
    };
  }
}
