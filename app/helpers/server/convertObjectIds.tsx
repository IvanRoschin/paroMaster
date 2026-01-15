import mongoose from 'mongoose';

export default function convertObjectIds(obj: any): any {
  if (obj == null) return obj;

  // ObjectId → string
  if (mongoose.isValidObjectId(obj)) {
    return obj.toString();
  }

  // Date → string
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectIds);
  }

  if (typeof obj === 'object') {
    const plain: any = {};
    for (const key of Object.keys(obj)) {
      plain[key] = convertObjectIds(obj[key]);
    }
    return plain;
  }

  return obj;
}
