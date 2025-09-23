'use server';

import { revalidatePath } from 'next/cache';

import Lid from '@/models/Lid';
import { connectToDB } from '@/utils/dbConnect';

export async function addNewLid(formData: FormData) {
  try {
    await connectToDB();
    // Check if email already exists
    const email = formData.get('email') as string;

    // const existingLid = await Lid.findOne({ email })
    // if (existingLid) {
    // 	throw new Error('Email already exists')
    // }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    const newLid = new Lid({
      name,
      phone,
      email,
    });
    await newLid.save();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newLid)),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding newLid:', error);
      throw new Error('Failed to add newLid: ' + error.message);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Failed to add newLid: Unknown error');
    }
  } finally {
    revalidatePath('/');
  }
}
