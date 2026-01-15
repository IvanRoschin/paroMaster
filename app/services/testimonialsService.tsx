'use server';

import { buildPagination, buildSort } from '@/helpers/server';
import toPlain from '@/helpers/server/toPlain';
import Good from '@/models/Good';
import Testimonial from '@/models/Testimonial';
import { ISearchParams, ITestimonial } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export async function addTestimonialService(values: Partial<ITestimonial>) {
  if (!values.author) throw new Error('Name and Surname is required.');
  if (!values.text || typeof values.text !== 'string')
    throw new Error('Text is required and must be a string');
  if (values.isActive === undefined)
    throw new Error('isActive field is required.');

  await connectToDB();

  const existingTestimonial = await Testimonial.findOne({
    author: values.author,
    text: values.text,
  });
  if (existingTestimonial)
    return { success: false, message: 'This testimonial already exists' };

  const testimonialData: Partial<ITestimonial> = {
    author: values.author,
    text: values.text,
    isActive: values.isActive,
    ...(values.product && { product: values.product }),
    ...(values.rating && { rating: values.rating }),
  };

  const newTestimonial = await Testimonial.create(testimonialData);

  if (newTestimonial && newTestimonial.product) {
    await recalculateRating(newTestimonial.product);
  }

  return {
    success: true,
    message: 'Відгук додано',
    testimonial: toPlain(newTestimonial),
  };
}

export async function getAllTestimonialsService(
  searchParams: ISearchParams = {}
) {
  await connectToDB();

  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);
  const sortOption = buildSort(searchParams);

  const filter: any = {};
  if (searchParams.status === 'Опублікований') filter.isActive = true;
  else if (searchParams.status === 'Не публікується') filter.isActive = false;

  const count = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  return {
    success: true,
    testimonials: testimonials.map(t => toPlain(t)),
    count,
  };
}

export async function getTestimonialByIdService(id: string) {
  if (!id) return null;
  await connectToDB();
  const testimonial = await Testimonial.findById(id);
  return testimonial ? toPlain(testimonial) : null;
}

export async function deleteTestimonialService(id: string) {
  if (!id) return { success: false, message: 'ID not provided' };
  await connectToDB();
  const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
  if (deletedTestimonial?.product)
    await recalculateRating(deletedTestimonial.product);
  return { success: true, message: 'Testimonial deleted' };
}

export async function updateTestimonialService(
  values: Partial<ITestimonial> & { _id: string }
) {
  const fieldsToRecalculate = ['rating', 'product', 'isActive'];

  const updateFields = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => key !== '_id' && value !== undefined
    )
  );
  if (Object.keys(updateFields).length === 0)
    return { success: false, message: 'No valid fields to update' };

  const shouldRecalculate = Object.keys(updateFields).some(field =>
    fieldsToRecalculate.includes(field)
  );

  await connectToDB();

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    values._id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedTestimonial)
    return { success: false, message: 'Testimonial not found' };
  if (shouldRecalculate && updatedTestimonial.product)
    await recalculateRating(updatedTestimonial.product);

  return {
    success: true,
    message: 'Testimonial updated successfully',
    testimonial: toPlain(updatedTestimonial),
  };
}

export async function getGoodTestimonialsService(productId: string) {
  await connectToDB();
  const testimonials = await Testimonial.find({ product: productId }).sort({
    createdAt: -1,
  });
  return testimonials.map(toPlain);
}

export async function recalculateRating(productId?: string) {
  if (!productId) return;

  const testimonials = await Testimonial.find({
    product: productId,
    isActive: true,
    rating: { $gt: 0 },
  });

  const ratingSum = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0);
  const ratingCount = testimonials.length;
  const averageRating = ratingCount ? ratingSum / ratingCount : null;

  await Good.findByIdAndUpdate(productId, { averageRating, ratingCount });
}
