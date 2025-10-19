const singularCategoryMap: Record<string, string> = {
  Бойлери: 'Бойлер',
  Електроклапани: 'Електроклапан',
  'Насоси(помпи)': 'Насос(помпа)',
  'Підошви для прасок': 'Підошва для праски',
  'Плати керування': 'Плата керування',
  'Резервуари для води': 'Резервуар для води',
  Парогенератори: 'Парогенератор',
  Фільтри: 'Фільтр',
};

export function getReadableGoodTitle(good: {
  category: string;
  brand: string;
  model: string;
}): string {
  const category = singularCategoryMap[good.category] || good.category;
  return [category, good.brand, good.model].filter(Boolean).join(' ');
}
