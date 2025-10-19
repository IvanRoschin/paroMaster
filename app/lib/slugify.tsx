import { transliterate } from 'transliteration';

export function slugify(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // убираем всё кроме букв, цифр, пробелов и дефисов
    .trim()
    .replace(/\s+/g, '-') // заменяем пробелы на дефисы
    .replace(/--+/g, '-'); // убираем двойные дефисы
}
