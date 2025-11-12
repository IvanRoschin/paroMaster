import { Metadata } from 'next';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  siteName?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  extra?: Partial<Metadata>;
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
  url = process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_URL ||
    'https://paromaster.com',
  siteName = 'ParoMaster',
  imageUrl = '/services/01.webp',
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = 'ParoMaster',
  extra = {},
}: MetadataProps): Metadata {
  return {
    metadataBase: url?.startsWith('http')
      ? new URL(url)
      : new URL('https://paromaster.com'),
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
          url: imageUrl.startsWith('http') ? imageUrl : `${url}${imageUrl}`,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl.startsWith('http') ? imageUrl : `${url}${imageUrl}`],
    },
    ...extra,
  };
}
