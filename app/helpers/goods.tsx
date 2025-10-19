// helpers/goods.ts
export const singularCategoryMap: Record<string, string> = {
  Бойлери: 'Бойлер',
  Електроклапани: 'Електроклапан',
  'Насоси(помпи)': 'Насос(помпа)',
  'Підошви для прасок': 'Підошва для праски',
  'Плати керування': 'Плата керування',
  'Резервуари для води': 'Резервуар для води',
  Парогенератори: 'Парогенератор',
  Фільтри: 'Фільтр',
};

export function getReadableGoodTitle({
  category,
  brand,
  model,
}: {
  category: string;
  brand: string;
  model: string;
}): string {
  const normalizedCategory = singularCategoryMap[category] || category;
  return [normalizedCategory, brand, model].filter(Boolean).join(' ');
}
