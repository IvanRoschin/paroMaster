'use server';

import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Customer from '@/models/Customer';
import Good from '@/models/Good';
import Order from '@/models/Order';
import Slider from '@/models/Slider';
import Testimonial from '@/models/Testimonial';
import User from '@/models/User';
import { connectToDB } from '@/utils/dbConnect';

export async function getEntityCounts() {
  try {
    await connectToDB();

    const [
      customers,
      orders,
      categories,
      goods,
      brands,
      users,
      testimonials,
      slides,
    ] = await Promise.all([
      Customer.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Good.countDocuments(),
      Brand.countDocuments(),
      User.countDocuments(),
      Testimonial.countDocuments(),
      Slider.countDocuments(),
    ]);

    return {
      success: true,
      counts: {
        customers,
        orders,
        categories,
        goods,
        brands,
        users,
        testimonials,
        slides,
      },
    };
  } catch (error) {
    console.error('Error fetching entity counts:', error);
    return { success: false, counts: {} };
  }
}
