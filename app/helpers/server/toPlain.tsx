// utils/toPlain.ts
export default function toPlain<T>(doc: any): T {
  if (!doc) return doc;

  const obj = doc.toObject ? doc.toObject({ getters: true }) : { ...doc };

  if (obj._id) obj._id = obj._id.toString();

  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val)) {
      obj[key] = val.map(v => {
        if (v && typeof v === 'object' && '_id' in v) {
          return { ...v, _id: v._id.toString() };
        }
        return v;
      });
    } else if (val && typeof val === 'object' && '_id' in val) {
      obj[key] = { ...val, _id: val._id.toString() };
    }
  }

  return JSON.parse(JSON.stringify(obj));
}

// export default function toPlain<T>(obj: any): T {
//   if (!obj) return obj;
//   if (Array.isArray(obj)) return obj.map(toPlain) as any;

//   if (typeof obj !== 'object') return obj;

//   const clone: any = {};
//   for (const key in obj) {
//     if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
//     const val = obj[key];

//     if (val?._bsontype === 'ObjectID') {
//       clone[key] = val.toString(); // ObjectId → string
//     } else if (val instanceof Date) {
//       clone[key] = val.toISOString();
//     } else if (Buffer.isBuffer(val)) {
//       clone[key] = val.toString('base64'); // Buffer → base64 string
//     } else if (val && typeof val === 'object') {
//       clone[key] = toPlain(val); // рекурсивно
//     } else {
//       clone[key] = val;
//     }
//   }
//   return clone as T;
// }
