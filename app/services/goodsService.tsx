'use server';

import mongoose from 'mongoose';

import toPlain from '@/app/helpers/server/toPlain';
import Brand from '@/models/Brand';
import Good, { GoodDocument, IGoodDB } from '@/models/Good';
import Testimonial from '@/models/Testimonial';
import { IBrand, IBrandLean } from '@/types/IBrand';
import { ICategory } from '@/types/ICategory';
import { IMinMaxPriceResponse } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export interface IGoodPopulated extends Omit<IGoodDB, 'brand' | 'category'> {
  brand: IBrand;
  category: ICategory;
}

export interface IGoodUI extends Omit<IGoodPopulated, '_id'> {
  _id: string;
  testimonials: any[];
  compatibleGoods: any[];
}
/**
 * Синхронизация двусторонней совместимости товаров.
 * Обеспечивает корректное добавление и удаление связей между товарами.
 *
 * @param currentGoodId - ID текущего товара
 * @param newIds - новые ID совместимых товаров (строки)
 * @param oldIds - старые ID совместимых товаров (строки)
 */
export async function syncCompatibilityRelations(
  currentGoodId: string,
  newIds: string[] = [],
  oldIds: string[] = []
): Promise<void> {
  const added = newIds.filter(id => !oldIds.includes(id));
  const removed = oldIds.filter(id => !newIds.includes(id));

  await Promise.all([
    // ➕ Добавленные связи
    ...added.map(async (cgId: string) => {
      const g: GoodDocument | null = await Good.findById(cgId);
      if (!g) return;

      // Преобразуем ObjectId в строки
      const gIds: string[] = g.compatibleGoods.map(id => id.toString());
      if (!gIds.includes(currentGoodId)) {
        g.compatibleGoods.push(new mongoose.Types.ObjectId(currentGoodId));
      }
      g.isCompatible = g.compatibleGoods.length > 0;
      await g.save();
    }),

    // ➖ Удалённые связи
    ...removed.map(async (cgId: string) => {
      const g: GoodDocument | null = await Good.findById(cgId);
      if (!g) return;

      // Фильтруем удаляемый ID
      g.compatibleGoods = g.compatibleGoods.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== currentGoodId
      );
      g.isCompatible = g.compatibleGoods.length > 0;
      await g.save();
    }),
  ]);
}

// ===== Получение всех товаров =====
export async function getAllGoodsService(
  filter: any = {},
  page = 1,
  limit = 20
) {
  await connectToDB();
  const skip = (page - 1) * limit;

  const goods = await Good.find(filter)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IGoodPopulated[]>();

  const count = await Good.countDocuments(filter);

  return {
    success: true,
    goods: goods.map(g => toPlain(g)),
    count,
  };
}

// ===== Получение товара по ID =====
export async function getGoodByIdService(id: string): Promise<IGoodUI | null> {
  await connectToDB();
  const good = await Good.findById(id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .lean<IGoodPopulated>();

  if (!good) return null;

  const testimonials = await Testimonial.find({
    product: id,
    isActive: true,
  }).lean();

  const compatibleGoodsRecords = await Good.find({
    _id: { $in: good.compatibleGoods },
  })
    .populate('brand', 'name slug')
    .populate('category', 'name slug')
    .lean<IGoodPopulated[]>();

  const result: IGoodUI = {
    ...toPlain<IGoodPopulated>(good),
    _id: good._id.toString(),
    testimonials,
    compatibleGoods: compatibleGoodsRecords.map(g =>
      toPlain<IGoodPopulated>(g)
    ),
  };

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
  const serializedGoods = goods.map(g => toPlain<IGoodUI>(g));

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

  const serializedGood = toPlain(newGood);

  return {
    success: true,
    message: 'Товар додано',
    good: serializedGood,
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

  const serializedGood = toPlain(existing);

  return {
    success: true,
    message: 'Товар оновлено',
    good: serializedGood,
  };
}

// ===== Удаление товара =====
export async function deleteGoodService(id: string) {
  await connectToDB();
  await Testimonial.deleteMany({ product: id });
  await Good.findByIdAndDelete(id);
  return { success: true, message: 'Товар видалено' };
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
