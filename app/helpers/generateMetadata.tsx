// helpers/metadata/generateMetadata.ts
import { Metadata } from 'next';

interface MetadataProps {
  title?: string; // Заголовок страницы
  description?: string; // Описание страницы
  keywords?: string[]; // Ключевые слова для SEO
  url?: string; // Канонический URL страницы
  siteName?: string; // Название сайта для OpenGraph
  imageUrl?: string; // OpenGraph изображение
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  extra?: Partial<Metadata>; // Любые дополнительные поля
}

export function generateMetadata({
  title = 'ParoMaster',
  description = 'ParoMaster – надійний партнер у ремонті та сервісі парогенераторів',
  keywords = [
    'ParoMaster',
    'парогенератор',
    'запчастини',
    'ремонт',
    'аксесуари',
  ],
  url = process.env.PUBLIC_URL || '',
  siteName = 'ParoMaster',
  imageUrl = '/default-og-image.jpg',
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = 'ParoMaster',
  extra = {},
}: MetadataProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    ...extra, // Можно пробросить любые дополнительные поля Metadata
  };
}
