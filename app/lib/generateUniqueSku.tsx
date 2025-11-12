import Good from '@/models/Good';
import { connectToDB } from '../utils/dbConnect';

const generateSimplesku = () =>
  Math.floor(100000000 + Math.random() * 900000000).toString();

export const generateUniqueSku = async (): Promise<string> => {
  await connectToDB();
  let sku = generateSimplesku();
  while (await Good.findOne({ sku })) {
    sku = generateSimplesku();
  }
  return sku;
};
