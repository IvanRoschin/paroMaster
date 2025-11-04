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
  if (searchParams.brands && searchParams.brands.length > 0) {
    const Brand = (await import('@/models/Brand')).default;
    const brandIds = [];

    for (const b of searchParams.brands) {
      if (mongoose.Types.ObjectId.isValid(b))
        brandIds.push(new mongoose.Types.ObjectId(b));
      else {
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
