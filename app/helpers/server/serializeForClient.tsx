import mongoose from 'mongoose';

export function serializeForClient(obj: any, seen = new WeakSet()): any {
  if (obj == null) return obj; // null или undefined

  // Примитивы
  if (typeof obj !== 'object') return obj;

  // Циклическая ссылка
  if (seen.has(obj)) return null;
  seen.add(obj);

  // Массив
  if (Array.isArray(obj))
    return obj.map(item => serializeForClient(item, seen));

  // ObjectId
  if (obj instanceof mongoose.Types.ObjectId || obj?._bsontype === 'ObjectID') {
    return obj.toString();
  }

  // Date
  if (obj instanceof Date) return obj.toISOString();

  // Buffer
  if (Buffer.isBuffer(obj)) return obj.toString('base64');

  // Mongoose-документ — превращаем в plain объект
  if (typeof obj.toObject === 'function') {
    obj = obj.toObject({ versionKey: false, flattenMaps: true });
  }

  // Обычный объект
  const plain: any = {};
  for (const key of Object.keys(obj)) {
    try {
      plain[key] = serializeForClient(obj[key], seen);
    } catch {
      plain[key] = null;
    }
  }
  return plain;
}
