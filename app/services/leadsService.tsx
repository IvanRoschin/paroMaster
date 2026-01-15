'use server';

import toPlain from '@/helpers/server/toPlain';
import Lead from '@/models/Lead';
import { connectToDB } from '@/utils/dbConnect';

export async function addNewLeadService(values: {
  name: string;
  email: string;
  phone: string;
}) {
  try {
    await connectToDB();

    const { name, email, phone } = values;

    const newLead = await Lead.create({ name, email, phone });

    return {
      success: true,
      data: toPlain(newLead),
    };
  } catch (error) {
    console.error('Error adding new lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
