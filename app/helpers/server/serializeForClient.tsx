import mongoose from 'mongoose';

/**
 * Сериализует объект для передачи в Client Component:
 * - ObjectId → string
 * - Date → ISO string
 * - Массивы и вложенные объекты рекурсивно
 */
export function serializeForClient(obj: any): any {
  if (obj == null) return obj; // null или undefined

  // Массив
  if (Array.isArray(obj)) return obj.map(serializeForClient);

  // ObjectId (Mongoose)
  if (obj instanceof mongoose.Types.ObjectId || obj?._bsontype === 'ObjectID') {
    return obj.toString();
  }

  // Date
  if (obj instanceof Date) return obj.toISOString();

  // Buffer — преобразуем в строку base64 (редко встречается)
  if (Buffer.isBuffer(obj)) return obj.toString('base64');

  // Mongoose-документ или обычный объект
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      try {
        result[key] = serializeForClient(obj[key]);
      } catch (e) {
        // На случай циклических ссылок или странных объектов
        result[key] = null;
      }
    }
    return result;
  }

  // Примитивы: string, number, boolean, null, undefined
  return obj;
}
