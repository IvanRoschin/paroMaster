'use server';

import mongoose from 'mongoose';

import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Good, { IGoodDB } from '@/models/Good';
import Testimonial from '@/models/Testimonial';
import { IBrand, IBrandLean } from '@/types/IBrand';
import { ICategory, ICategoryLean } from '@/types/ICategory';
import { IMinMaxPriceResponse } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

import { GoodsFilters } from '../actions';
import buildFilterFromContext from '../helpers/server/buildFilter';
import { serializeForClient } from '../helpers/server/serializeForClient';

export interface IGoodPopulated extends Omit<IGoodDB, 'brand' | 'category'> {
  brand: IBrand;
  category: ICategory;
}

export interface IGoodUI extends Omit<IGoodPopulated, '_id'> {
  _id: string;
  testimonials: any[];
  compatibleGoods: any[];
}
export async function syncCompatibilityRelations(
  currentGoodId: string,
  newIds: string[] = [],
  oldIds: string[] = []
): Promise<void> {
  const added = newIds.filter(id => !oldIds.includes(id));
  const removed = oldIds.filter(id => !newIds.includes(id));

  // ➕ Добавленные связи
  await Promise.all(
    added.map(async (cgId: string) => {
      // Добавляем текущий товар в compatibleGoods другого товара, если его там нет
      await Good.updateOne(
        { _id: cgId, compatibleGoods: { $ne: currentGoodId } },
        {
          $push: { compatibleGoods: currentGoodId },
          $set: { isCompatible: true },
        }
      );
    })
  );

  // ➖ Удалённые связи
  await Promise.all(
    removed.map(async (cgId: string) => {
      const updated = await Good.findByIdAndUpdate(
        cgId,
        {
          $pull: { compatibleGoods: currentGoodId },
        },
        { new: true } // возвращает обновлённый документ
      );

      if (!updated) return;

      // Обновляем isCompatible
      const hasCompatibles = updated.compatibleGoods.length > 0;
      if (updated.isCompatible !== hasCompatibles) {
        updated.isCompatible = hasCompatibles;
        await updated.save();
      }
    })
  );
}

// ===== Получение всех товаров =====
export async function getAllGoodsService(filters: GoodsFilters) {
  await connectToDB();

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const { filter, sortOption } = await buildFilterFromContext(filters);

  const goods = await Good.find(filter)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean<IGoodPopulated[]>();

  const count = await Good.countDocuments(filter);

  const plainGoods = goods.map(good => serializeForClient(good));

  return {
    success: true,
    goods: plainGoods,
    count,
  };
}

// ===== Получение товара по ID =====
export async function getGoodByIdService(id: string): Promise<IGoodUI | null> {
  await connectToDB();
  const good = await Good.findById(id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .exec();

  if (!good) return null;

  const [testimonialsRaw, compatibleGoodsRaw] = await Promise.all([
    Testimonial.find({ product: id, isActive: true }).lean().exec(),
    Good.find({ _id: { $in: good.compatibleGoods } })
      .populate('brand', 'name slug')
      .populate('category', 'name slug')
      .lean()
      .exec(),
  ]);

  const result: IGoodUI = {
    ...serializeForClient(good),
    testimonials: testimonialsRaw.map(testimonial =>
      serializeForClient(testimonial)
    ),
    compatibleGoods: compatibleGoodsRaw.map(compatibleGood =>
      serializeForClient(compatibleGood)
    ),
  };
  console.log('result', result);

  return result;
}

// ===== Получение товара по бренду =====
export async function getGoodsByBrandService(
  brandSlug: string,
  excludeId?: string
): Promise<IGoodUI[]> {
  await connectToDB();

  // Находим бренд по slug
  const brand = await Brand.findOne({ slug: brandSlug }).lean<IBrandLean>();
  if (!brand?._id) return [];

  // Формируем запрос по ObjectId бренда

  const query: Record<string, unknown> = {
    brand: new mongoose.Types.ObjectId(String(brand._id)),
  };
  if (excludeId)
    query._id = { $ne: new mongoose.Types.ObjectId(String(excludeId)) };

  // Ищем товары с этим брендом
  const goods = await Good.find(query)
    .populate('brand')
    .populate('category')
    .lean<IGoodUI[]>();

  // Сериализуем, чтобы избежать Mongoose-specific свойств
  const serializedGoods = goods.map(g => serializeForClient(g));

  return serializedGoods;
}

// ===== Получение товара по категории =====
export async function getGoodsByCategoryService(
  categorySlug: string,
  excludeId?: string
): Promise<IGoodUI[]> {
  await connectToDB();

  // Находим категорию по slug
  const category = await Category.findOne({
    slug: categorySlug,
  }).lean<ICategoryLean>();
  if (!category?._id) return [];

  // Формируем запрос по ObjectId категории
  const query: Record<string, unknown> = {
    category: new mongoose.Types.ObjectId(String(category._id)),
  };
  if (excludeId)
    query._id = { $ne: new mongoose.Types.ObjectId(String(excludeId)) };

  // Ищем товары с этой категорией
  const goods = await Good.find(query)
    .populate('brand')
    .populate('category')
    .lean<IGoodUI[]>();

  // Сериализуем результаты
  const serializedGoods = goods.map(g => serializeForClient(g));

  return serializedGoods;
}

// ===== Добавление нового товара =====
export async function addGoodService(values: Partial<IGoodDB>) {
  await connectToDB();

  // Валидация обязательных полей
  const requiredFields: (keyof IGoodDB)[] = [
    'title',
    'description',
    'price',
    'category',
    'brand',
    'model',
    'sku',
  ];
  for (const field of requiredFields) {
    if (!values[field])
      return { success: false, message: `Поле "${field}" є обов'язковим` };
  }

  // Проверка дубликатов по SKU
  const duplicate = await Good.findOne({ sku: values.sku });
  if (duplicate)
    return { success: false, message: 'Товар з таким SKU вже існує' };

  const compatibleGoodsIds = Array.isArray(values.compatibleGoods)
    ? values.compatibleGoods.map(id => id.toString())
    : [];

  const newGood = await Good.create(values);

  // Синхронизация совместимости

  if (compatibleGoodsIds.length > 0) {
    await syncCompatibilityRelations(
      newGood._id.toString(),
      compatibleGoodsIds,
      []
    );
  }

  return {
    success: true,
    message: 'Товар додано',
    good: serializeForClient(newGood),
  };
}

// ===== Обновление товара =====
export async function updateGoodService(id: string, values: Partial<IGoodDB>) {
  await connectToDB();

  const existing = await Good.findById(id);

  if (!existing) return { success: false, message: 'Товар не знайдено' };

  const oldCompatibleGoods = (existing.compatibleGoods || []).map(String);

  const newCompatibleGoods = Array.isArray(values.compatibleGoods)
    ? values.compatibleGoods.map(id => id.toString())
    : [];

  Object.assign(existing, values);
  await existing.save();

  // Синхронизация совместимости
  await syncCompatibilityRelations(id, newCompatibleGoods, oldCompatibleGoods);

  return {
    success: true,
    message: 'Товар оновлено',
    good: serializeForClient(existing),
  };
}

// ===== Удаление товара =====
export async function deleteGoodService(id: string) {
  await connectToDB();
  await Testimonial.deleteMany({ product: id });
  await Good.findByIdAndDelete(id);
  return { success: true, message: 'Товар видалено' };
}

// ===== Получения cписка наиболее популярных товаров =====
export async function getMostPopularGoodsService(
  limit = 10
): Promise<IGoodUI[]> {
  try {
    await connectToDB();
    const popularGoods = await Good.find({ isAvailable: true })
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(limit)
      .populate('category', 'name slug src')
      .populate('brand', 'name slug src country website')
      .exec();
    const serializedGoods: IGoodUI[] = popularGoods.map(popularGood =>
      serializeForClient(popularGood)
    );
    return serializedGoods;
  } catch (error) {
    console.error('Error fetching most popular goods:', error);
    return [];
  }
}

// ===== Получения минимальной и максимальной цены товара =====
export async function getMinMaxPriceService(): Promise<IMinMaxPriceResponse> {
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
