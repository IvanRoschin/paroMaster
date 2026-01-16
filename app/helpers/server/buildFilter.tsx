'use server';

import mongoose from 'mongoose';

import Brand from '@/models/Brand';
import Category from '@/models/Category';

interface GoodsFilters {
  brands?: string[]; // массив _id брендов
  category?: string; // slug категории
  low?: number | null; // минимальная цена
  high?: number | null; // максимальная цена
  sort?: 'asc' | 'desc' | ''; // сортировка
  page?: number | string;
  limit?: number | string;
}

/**
 * Преобразует массив строк (ObjectId) в ObjectId
 */
async function resolveIds(
  ids: string[],
  Model: any
): Promise<mongoose.Types.ObjectId[]> {
  const objectIds: mongoose.Types.ObjectId[] = [];
  for (const id of ids) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      objectIds.push(new mongoose.Types.ObjectId(id));
    } else {
      // Если вдруг передан slug/name вместо _id
      const found = await Model.findOne({
        $or: [{ slug: id }, { name: { $regex: id, $options: 'i' } }],
      });
      if (found) objectIds.push(found._id);
    }
  }
  return objectIds;
}

/**
 * Построение фильтра для Mongo
 */
export default async function buildFilterFromContext(filters: GoodsFilters) {
  const filter: any = {};
  const sortOption: any = {};

  // ===========================
  // Категория по slug
  // ===========================
  if (filters.category) {
    const category = await Category.findOne({ slug: filters.category });
    if (category) {
      filter.category = category._id;
    } else {
      // Если категория не найдена → пустой результат
      filter._id = { $exists: false };
      return { filter, sortOption };
    }
  }

  // ===========================
  // Мультивыбор брендов по _id
  // ===========================
  if (filters.brands?.length) {
    const brandIds = await resolveIds(filters.brands, Brand);
    if (brandIds.length > 0) {
      filter.brand = { $in: brandIds };
    } else {
      filter._id = { $exists: false };
      return { filter, sortOption };
    }
  }

  // ===========================
  // Диапазон цены
  // ===========================
  if (filters.low != null || filters.high != null) {
    filter.price = {};
    if (filters.low != null) filter.price.$gte = filters.low;
    if (filters.high != null) filter.price.$lte = filters.high;
  }

  // ===========================
  // Сортировка
  // ===========================
  if (filters.sort === 'asc') sortOption.price = 1;
  else if (filters.sort === 'desc') sortOption.price = -1;

  return { filter, sortOption };
}
