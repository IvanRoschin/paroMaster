'use server';

import { buildPagination } from '@/helpers/index';
import toPlain from '@/helpers/server/toPlain';
import Slider from '@/models/Slider';
import { ISearchParams, ISlider } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

// ====== Service ======
export async function addSlideService(values: Partial<ISlider>) {
  if (!values.title) throw new Error('Title is required.');
  if (!values.desc || typeof values.desc !== 'string')
    throw new Error('Desc is required and must be a string');
  if (values.isActive === undefined)
    throw new Error('isActive field is required.');

  await connectToDB();

  const existingSlide = await Slider.findOne({
    title: values.title,
    desc: values.desc,
  });
  if (existingSlide)
    return { success: false, message: 'This slide already exists' };

  const slide = await Slider.create(values);
  return {
    success: true,
    message: 'Слайд успішно доданий',
    slide: toPlain(slide),
  };
}

export async function getAllSlidesService(searchParams: ISearchParams = {}) {
  await connectToDB();

  const currentPage = Number(searchParams.page) || 1;
  const { skip, limit } = buildPagination(searchParams, currentPage);

  const count = await Slider.countDocuments();
  const slides = await Slider.find().skip(skip).limit(limit);

  return {
    success: true,
    slides: slides.map(s => toPlain(s)),
    count,
  };
}

export async function getSlideByIdService(id: string) {
  if (!id) return null;
  await connectToDB();
  const slide = await Slider.findById(id);
  return slide ? toPlain(slide) : null;
}

export async function deleteSlideService(id: string) {
  if (!id) return { success: false, message: 'ID not provided' };
  await connectToDB();
  await Slider.findByIdAndDelete(id);
  return { success: true, message: 'Slide deleted successfully' };
}

export async function updateSlideService(id: string, values: Partial<ISlider>) {
  await connectToDB();

  const updateFields = { ...values };

  // очистка пустых полей
  Object.keys(updateFields).forEach(key => {
    const typedKey = key as keyof ISlider;
    const val = updateFields[typedKey];

    if (val === '' || val === undefined) {
      delete updateFields[typedKey];
    }
  });

  await Slider.findByIdAndUpdate(id, updateFields);

  return { success: true, message: 'Слайд оновлено успішно' };
}
