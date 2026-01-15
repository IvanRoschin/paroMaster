'use server';

import { revalidatePath } from 'next/cache';

import { addNewLeadService } from '../services/leadsService';

export async function addNewLeadAction(values: {
  name: string;
  email: string;
  phone: string;
}) {
  const result = await addNewLeadService(values);
  revalidatePath('/');
  return result;
}
// 'use server';

// import { revalidatePath } from 'next/cache';

// import Lead from '@/models/Lead';
// import { connectToDB } from '@/utils/dbConnect';

// export async function addNewLead(formData: FormData) {
//   try {
//     await connectToDB();
//     const email = formData.get('email') as string;
//     const name = formData.get('name') as string;
//     const phone = formData.get('phone') as string;

//     const newLead = new Lead({
//       name,
//       phone,
//       email,
//     });
//     await newLead.save();
//     return {
//       success: true,
//       data: JSON.parse(JSON.stringify(newLead)),
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Error adding newLid:', error);
//       throw new Error('Failed to add newLid: ' + error.message);
//     } else {
//       console.error('Unknown error:', error);
//       throw new Error('Failed to add newLid: Unknown error');
//     }
//   } finally {
//     revalidatePath('/');
//   }
// }
