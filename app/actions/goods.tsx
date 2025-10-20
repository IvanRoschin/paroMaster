'use server';

import mongoose from 'mongoose';

import { buildFilter } from '@/helpers/server';
import Good from '@/models/Good';
import Testimonial from '@/models/Testimonial';
import {
  IGoodDB,
  IGoodUI,
  IMinMaxPriceResponse,
  ISearchParams,
} from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export interface IGetAllGoods {
  success: boolean;
  goods: IGoodUI[];
  count: number;
}

export type IGoodCreate = Omit<IGoodDB, '_id'>;

// ======================= Сериализация =======================
function serializeGood(g: any): IGoodUI {
  return {
    _id: g._id.toString(),
    title: g.title,
    description: g.description,
    price: g.price,
    discountPrice: g.discountPrice ?? 0,
    src: Array.isArray(g.src) ? g.src : g.src ? [g.src] : [],
    category: g.category
      ? {
          _id: g.category._id.toString(),
          name: g.category.name,
          slug: g.category.slug || '',
          src: g.category.src || '',
        }
      : null,
    brand: g.brand
      ? {
          _id: g.brand._id.toString(),
          name: g.brand.name,
          slug: g.brand.slug || '',
          src: g.brand.src || undefined,
          country: g.brand.country || undefined,
          website: g.brand.website || undefined,
        }
      : null,
    model: g.model ?? '',
    sku: g.sku ?? '',
    isNew: g.isNew ?? false,
    isAvailable: g.isAvailable ?? true,
    isDailyDeal: g.isDailyDeal ?? false,
    isCompatible: g.isCompatible ?? false,
    compatibleGoods: Array.isArray(g.compatibleGoods)
      ? g.compatibleGoods.map((cg: any) =>
          typeof cg === 'string' ? cg : cg._id
        )
      : [],
    quantity: g.quantity ?? 0,
    averageRating: g.averageRating ?? 0,
    ratingCount: g.ratingCount ?? 0,
  };
}

// ======================= ACTIONS =======================

export async function getAllGoods(
  searchParams: ISearchParams
): Promise<IGetAllGoods> {
  const filter = await buildFilter(searchParams);

  const currentPage = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 20;
  const skip = (currentPage - 1) * limit;

  try {
    await connectToDB();

    const count = await Good.countDocuments(filter);

    const goods = await Good.find(filter)
      .populate('category', 'name slug src')
      .populate('brand', 'name slug src country website')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const serializedGoods: IGoodUI[] = goods.map(serializeGood);

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

export async function getDailyDeals(maxPrice: number): Promise<IGoodUI[]> {
  await connectToDB();

  const dailyDeals = await Good.find({
    discountPrice: { $lt: maxPrice },
    isAvailable: true,
  }).limit(4);

  return dailyDeals.map(serializeGood);
}

export async function getGoodById(id: string): Promise<IGoodUI | null> {
  await connectToDB();

  const good = await Good.findById(id)
    .populate('category', 'name slug src')
    .populate('brand', 'name slug src country website');

  if (!good) return null;

  const testimonials = await Testimonial.find({
    product: id,
    isActive: true,
  }).sort({ createdAt: -1 });
  const compatibleGoods = await Good.find({
    isCompatible: true,
    compatibleGoods: { $regex: good.model, $options: 'i' },
  });

  // Преобразуем в plain object
  const plainGood: IGoodUI = {
    ...serializeGood(good), // возвращает plain объект
    testimonials: testimonials.map(t => ({
      _id: t._id.toString(),
      name: t.name,
      text: t.text,
      rating: t.rating,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      isActive: t.isActive,
    })),
    compatibleGoods: compatibleGoods.map(g => serializeGood(g)),
  };

  return plainGood;
}

export async function addGood(formData: FormData) {
  const values: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const cleanKey = key.replace('[]', '');
      if (!values[cleanKey]) values[cleanKey] = [];
      values[cleanKey].push(value);
    } else {
      values[key] = value;
    }
  });

  values.price = Number(values.price);
  values.discountPrice = Number(values.discountPrice ?? 0);

  const requiredFields = [
    'category',
    'title',
    'brand',
    'model',
    'sku',
    'price',
    'description',
    'src',
  ];

  for (const field of requiredFields) {
    if (
      !values[field] ||
      (Array.isArray(values[field]) && values[field].length === 0)
    ) {
      return { success: false, message: `Поле "${field}" є обов'язковим` };
    }
  }

  try {
    await connectToDB();

    const existingGood = await Good.findOne({ sku: values.sku });
    if (existingGood)
      return { success: false, message: 'Товар з таким SKU вже існує' };

    const newGood: IGoodCreate = {
      category: values.category,
      brand: values.brand,
      title: values.title,
      model: values.model,
      sku: values.sku,
      price: values.price,
      discountPrice: values.discountPrice,
      description: values.description,
      src: Array.isArray(values.src) ? values.src : [values.src],
      isNew: values.isNew === 'true' || values.isNew === true,
      isAvailable: values.isAvailable === 'true' || values.isAvailable === true,
      isDailyDeal: values.isDailyDeal === 'true' || values.isDailyDeal === true,
      isCompatible:
        values.isCompatible === 'true' || values.isCompatible === true,
      compatibleGoods: values.compatibleGoods
        ? Array.isArray(values.compatibleGoods)
          ? values.compatibleGoods
          : [values.compatibleGoods]
        : [],
    };

    await Good.create(newGood);
    return { success: true, message: 'Товар додано успішно' };
  } catch (error) {
    console.error('Помилка додавання товару:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors = Object.values(error.errors)
        .map(e => e.message)
        .join(', ');
      return { success: false, message: `Помилка валідації: ${fieldErrors}` };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Невідома помилка',
    };
  }
}

export async function updateGood(formData: FormData) {
  const values: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (!values[key]) values[key] = [];
    values[key].push(value);
  });

  Object.keys(values).forEach(key => {
    if (values[key].length === 1) values[key] = values[key][0];
  });

  const {
    id,
    category,
    brand,
    src,
    model,
    sku,
    title,
    description,
    price,
    discountPrice,
    isNew,
    isAvailable,
    isDailyDeal,
    isCompatible,
    compatibleGoods,
  } = values;

  try {
    await connectToDB();

    const updateFields: Partial<IGoodDB> = {
      category: category || undefined,
      brand: brand || undefined,
      src: src ? (Array.isArray(src) ? src : [src]) : undefined,
      model,
      sku,
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      discountPrice:
        discountPrice !== undefined ? Number(discountPrice) : undefined,
      isNew: isNew === 'true',
      isAvailable: isAvailable === 'true',
      isDailyDeal: isDailyDeal === 'true',
      isCompatible: isCompatible === 'true',
      compatibleGoods: compatibleGoods
        ? Array.isArray(compatibleGoods)
          ? compatibleGoods
          : [compatibleGoods]
        : [],
    };

    Object.keys(updateFields).forEach(key => {
      if (
        updateFields[key as keyof IGoodDB] === undefined ||
        updateFields[key as keyof IGoodDB] === ''
      ) {
        delete updateFields[key as keyof IGoodDB];
      }
    });

    await Good.findByIdAndUpdate(id, updateFields);
    return { success: true, message: 'Товар оновлено успішно' };
  } catch (error) {
    console.error('Помилка оновлення товару:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Невідома помилка',
    };
  }
}

export async function getMinMaxPrice(): Promise<IMinMaxPriceResponse> {
  try {
    await connectToDB();
    const result = await Good.aggregate([
      {
        $project: {
          price: { $toDouble: '$price' },
          discountPrice: { $toDouble: '$discountPrice' },
        },
      },
      { $match: { price: { $ne: null } } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          minDiscountPrice: { $min: '$discountPrice' },
          maxDiscountPrice: { $max: '$discountPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          minPrice: 1,
          maxPrice: 1,
          minDiscountPrice: 1,
          maxDiscountPrice: 1,
        },
      },
    ]).exec();
    if (!result.length)
      return {
        success: false,
        minPrice: null,
        maxPrice: null,
        minDiscountPrice: null,
        maxDiscountPrice: null,
        message: 'No valid goods found',
      };
    return {
      success: true,
      minPrice: result[0].minPrice,
      maxPrice: result[0].maxPrice,
      minDiscountPrice: result[0].minDiscountPrice,
      maxDiscountPrice: result[0].maxDiscountPrice,
    };
  } catch (error: any) {
    console.error('Error fetching min/max price:', error);
    return {
      success: false,
      minPrice: null,
      maxPrice: null,
      minDiscountPrice: null,
      maxDiscountPrice: null,
      message: error.message,
    };
  }
}

export async function getMostPopularGoods(limit = 10): Promise<IGoodUI[]> {
  try {
    await connectToDB();

    const popularGoods = await Good.find({ isAvailable: true })
      .sort({ averageRating: -1, ratingCount: -1 }) // сначала по рейтингу, потом по количеству отзывов
      .limit(limit)
      .populate('category', 'name slug src')
      .populate('brand', 'name slug src country website')
      .exec();

    // Сериализация в plain objects
    const serializedGoods: IGoodUI[] = popularGoods.map(serializeGood);

    return serializedGoods;
  } catch (error) {
    console.error('Error fetching most popular goods:', error);
    return [];
  }
}
