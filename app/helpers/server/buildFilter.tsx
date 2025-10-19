import mongoose from 'mongoose';

import { ISearchParams } from '@/types/searchParams';

export async function buildFilter(searchParams: ISearchParams): Promise<any> {
  const filter: any = {};
  const andConditions: any[] = [];

  // ======== Категорія ========
  if (searchParams.category) {
    const Category = (await import('@/models/Category')).default;

    if (mongoose.Types.ObjectId.isValid(searchParams.category)) {
      filter.category = new mongoose.Types.ObjectId(searchParams.category);
    } else {
      const foundCategory = await Category.findOne({
        $or: [
          { title: { $regex: searchParams.category, $options: 'i' } },
          { slug: { $regex: searchParams.category, $options: 'i' } },
        ],
      });

      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        filter.category = { $exists: false };
      }
    }
  }

  // ======== Бренд ========
  if (searchParams.brand) {
    const Brand = (await import('@/models/Brand')).default;

    if (mongoose.Types.ObjectId.isValid(searchParams.brand)) {
      filter.brand = new mongoose.Types.ObjectId(searchParams.brand);
    } else {
      const foundBrand = await Brand.findOne({
        $or: [
          { name: { $regex: searchParams.brand, $options: 'i' } },
          { slug: { $regex: searchParams.brand, $options: 'i' } },
        ],
      });

      if (foundBrand) {
        filter.brand = foundBrand._id;
      } else {
        return { _id: { $exists: false } };
      }
    }
  }

  // ======== Ціна ========
  const low = Number(searchParams.low);
  const high = Number(searchParams.high);
  if (!isNaN(low) && !isNaN(high)) {
    filter.price = { $gte: low, $lte: high };
  }

  // ======== Пошук ========
  if (searchParams.q) {
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

  // ======== Активність ========
  if (searchParams.isActive !== undefined) {
    filter.isActive = searchParams.isActive;
  }

  return filter;
}

export default buildFilter;
