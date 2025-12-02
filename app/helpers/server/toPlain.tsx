import mongoose from 'mongoose';

const toPlain = <T = any,>(doc: any): T => {
  if (doc == null) return doc as any; // null или undefined

  // Массив — обрабатываем сразу
  if (Array.isArray(doc)) {
    return doc.map(toPlain) as any;
  }

  // Mongoose-документ — сначала превращаем в объект
  if (typeof (doc as any).toObject === 'function') {
    doc = (doc as any).toObject({
      versionKey: false,
      flattenMaps: true,
      // flattenObjectIds: true, // можно оставить, но мы и так вручную обработаем
    });
  }

  // Теперь doc — точно объект (или примитив)
  if (doc && typeof doc === 'object') {
    const plainObj: any = {};

    for (const key in doc) {
      if (!Object.prototype.hasOwnProperty.call(doc, key)) continue;

      let value = doc[key];

      // === КЛЮЧЕВОЙ БЛОК: ловим ВСЕ возможные варианты ObjectId ===
      if (
        value instanceof mongoose.Types.ObjectId ||
        (value && (value as any)._bsontype === 'ObjectID') ||
        (value && Buffer.isBuffer((value as any).buffer || (value as any).id)) // редкий кейс
      ) {
        value = value.toString();
      }
      // =================================================

      plainObj[key] = toPlain(value); // рекурсия
    }

    return plainObj as T;
  }

  // Примитивы (строки, числа, boolean и т.д.)
  return doc as T;
};

export default toPlain;
