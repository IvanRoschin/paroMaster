// utils/toPlain.ts
export function toPlain<T>(doc: any): T {
  if (!doc) return doc;

  const obj = doc.toObject ? doc.toObject({ getters: true }) : doc;
  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val === 'object') {
      if (val._id) {
        obj[key]._id = val._id.toString();
      }
      if (Array.isArray(val)) {
        obj[key] = val.map(v =>
          v && v._id ? { ...v, _id: v._id.toString() } : v
        );
      }
    }
  }

  if (obj._id) obj._id = obj._id.toString();
  return JSON.parse(JSON.stringify(obj));
}
