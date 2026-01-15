export const toPlainWithStringIds = (doc: any) => {
  return doc?.toObject
    ? doc.toObject({ flattenObjectIds: true, flattenMaps: true })
    : doc;
};
