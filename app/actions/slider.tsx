'use server';

import { buildPagination } from '@/helpers/index';
import Slider from '@/models/Slider';
import { ISearchParams, ISlider } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';

export interface IGetAllSlides {
  success: boolean;
  slides: ISlider[];
  count: number;
}

export async function addSlide(values: Partial<ISlider>) {
  if (!values.title) {
    throw new Error('Title is required.');
  }
  if (!values.desc || typeof values.desc !== 'string') {
    throw new Error('Desc is required and must be a string');
  }
  if (values.isActive === undefined) {
    throw new Error('isActive field is required.');
  }
  try {
    await connectToDB();

    const existingSlide = await Slider.findOne({
      title: values.title,
      desc: values.desc,
    });

    if (existingSlide) {
      throw new Error('This slide already exists');
    }

    await Slider.create(values);
    return {
      success: true,
      message: 'Слайд успішно доданий',
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding Slide:', error);
      throw new Error('Failed to add Slide: ' + error.message);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to add category: Unknown error');
    }
  }
}

export async function getAllSlides(
  searchParams: ISearchParams
): Promise<IGetAllSlides> {
  const currentPage = Number(searchParams.page) || 1;

  const { skip, limit } = buildPagination(searchParams, currentPage);

  try {
    await connectToDB();

    const count = await Slider.countDocuments();

    const slides: ISlider[] = await Slider.find()
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      success: true,
      slides: JSON.parse(JSON.stringify(slides)),
      count: count,
    };
  } catch (error) {
    console.log(error);
    return { success: false, slides: [], count: 0 };
  }
}

export async function getSlideById(id: string) {
  try {
    await connectToDB();
    const category = await Slider.findById({ _id: id });
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting Slide:', error);
      throw new Error('Failed to get categories: ' + error.message);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to get categories: Unknown error');
    }
  }
}

export async function deleteSlide(id: string): Promise<void> {
  if (!id) return;
  await connectToDB();
  await Slider.findByIdAndDelete(id);
}

export async function updateSlide(values: any) {
  const updateFields = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => key !== '_id' && value !== undefined
    )
  );
  if (Object.keys(updateFields).length === 0) {
    return {
      success: false,
      message: 'No valid fields to update.',
    };
  }
  try {
    await connectToDB();

    const updatedSlide = await Slider.findByIdAndUpdate(
      values._id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedSlide) {
      return {
        success: false,
        message: 'Slide not found.',
      };
    }
    return {
      success: true,
      message: 'Slide updated successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error update Slide:', error);
      throw new Error('Failed to update Slide: ' + error.message);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to update Slide: Unknown error');
    }
  }
}
