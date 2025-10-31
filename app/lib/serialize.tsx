export function serializeDoc<T>(doc: any): T {
  if (!doc) return doc;
  return JSON.parse(JSON.stringify(doc.toObject({ getters: true })));
}
