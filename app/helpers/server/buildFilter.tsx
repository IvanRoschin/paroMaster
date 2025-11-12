import mongoose from 'mongoose';

import { ISearchParams } from '@/types/searchParams';

export async function buildFilter(searchParams: ISearchParams): Promise<any> {
  const filter: any = {};
  const andConditions: any[] = [];

  // ======== Категории (мультивыбор) ========
  if (searchParams.category) {
    const Category = (await import('@/models/Category')).default;
    const categories: string[] = Array.isArray(searchParams.category)
      ? searchParams.category
      : [searchParams.category];

    const categoryIds: mongoose.Types.ObjectId[] = [];

    for (const c of categories.filter(
      c => typeof c === 'string' && c.trim() !== ''
    )) {
      if (mongoose.Types.ObjectId.isValid(c)) {
        categoryIds.push(new mongoose.Types.ObjectId(c));
      } else {
        const foundCategory = await Category.findOne({
          $or: [
            { title: { $regex: c, $options: 'i' } },
            { slug: { $regex: c, $options: 'i' } },
          ],
        });
        if (foundCategory) categoryIds.push(foundCategory._id);
      }
    }

    if (categoryIds.length > 0) filter.category = { $in: categoryIds };
    else filter._id = { $exists: false }; // если ничего не найдено
  }

  // ======== Бренды (мультивыбор) ========
  if (searchParams.brands && searchParams.brands.length > 0) {
    const Brand = (await import('@/models/Brand')).default;
    const brandIds: mongoose.Types.ObjectId[] = [];

    const brandStrings: string[] = (
      searchParams.brands as (string | undefined)[]
    ).filter((b): b is string => typeof b === 'string' && b.trim() !== '');

    for (const b of brandStrings) {
      if (mongoose.Types.ObjectId.isValid(b)) {
        brandIds.push(new mongoose.Types.ObjectId(b));
      } else {
        const foundBrand = await Brand.findOne({
          $or: [
            { name: { $regex: b, $options: 'i' } },
            { slug: { $regex: b, $options: 'i' } },
          ],
        });
        if (foundBrand) brandIds.push(foundBrand._id);
      }
    }

    if (brandIds.length > 0) filter.brand = { $in: brandIds };
    else filter._id = { $exists: false };
  }

  // ======== Цена ========
  const low = Number(searchParams.low);
  const high = Number(searchParams.high);
  if (!isNaN(low) && !isNaN(high)) {
    filter.price = { $gte: low, $lte: high };
  }

  // ======== Поиск ========
  if (
    searchParams.q &&
    typeof searchParams.q === 'string' &&
    searchParams.q.trim() !== ''
  ) {
    const regex = new RegExp(searchParams.q, 'i');
    andConditions.push({
      $or: [
        { title: regex },
        { sku: regex },
        { model: regex },
        { compatibility: regex },
      ],
    });
  }

  if (andConditions.length) filter.$and = andConditions;

  // ======== Активность ========
  if (typeof searchParams.isActive !== 'undefined') {
    filter.isActive = searchParams.isActive;
  }

  return filter;
}

export default buildFilter;
