'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { getAllCategories } from '@/actions/categories';
import { addNewLead } from '@/actions/leads';
import { LeadForm } from '@/components/forms';
import { EmptyState, Logo, Socials } from '@/components/index';
import { useMediaQuery } from '@/hooks/index';
import { ICategory } from '@/types/ICategory';
import { ISearchParams } from '@/types/searchParams';

interface CategoryItem {
  value: string;
  label: string;
  src: string;
  slug: string;
}

interface FooterProps {
  searchParams?: ISearchParams;
}

const infoLinks = [
  { title: 'Оплата та доставка', link: 'delivery' },
  { title: 'Послуги та сервіси', link: 'services' },
  { title: 'Гарантія', link: 'guarantee' },
  { title: 'Контакти', link: 'contact' },
  { title: 'Політика Конфіденційності', link: 'privacypolicy' },
  { title: 'Публічна Оферта', link: 'publicoffer' },
];

const goodsLinks = [
  { title: 'Популярні товари', link: 'populargoods' },
  { title: 'Акції та знижки', link: '/' },
];

const Footer: React.FC<FooterProps> = ({ searchParams }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const sp = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(sp.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      return params.toString();
    },
    [sp]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories(searchParams ?? {});
        const cats: CategoryItem[] =
          (res.categories ?? [])
            .filter((c: ICategory) => c._id)
            .map((c: ICategory) => ({
              value: String(c._id),
              label: c.name ?? 'Без назви',
              src: c.src ?? '',
              slug: c.slug ?? '',
            })) ?? [];
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, [searchParams]);

  const baseUrl =
    typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_URL || '';

  if (!categories.length) return <EmptyState showReset />;

  const renderLinksList = (links: { title: string; link: string }[]) => (
    <ul className="text-sm flex flex-col gap-1">
      {links.map((item, index) => (
        <li
          key={index}
          className="nav hover:translate-x-2 transition-transform duration-200"
        >
          <Link href={`/${item.link.toLowerCase().replace(/ /g, '-')}`}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderCategoriesList = () => (
    <ul className="text-sm flex flex-col gap-1">
      {categories.map(({ value, label, src }, i) => (
        <li key={i} className="nav flex items-center gap-2">
          <Link
            href={`/category/?${createQueryString('category', value)}`}
            className="flex items-center group"
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={label}
              width={20}
              height={20}
              className="w-5 h-5 mr-2 group-hover:filter-primary transition-filter duration-300"
              priority
            />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-slate-800 text-white p-8">
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between w-full">
          <Logo color="white" />
          <Socials color="white" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Доставка та Оплата */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1 text-2xl flex flex-col gap-4">
              <span>Доставка</span>
              <div className="border-b border-primaryAccentColor mb-2" />
              <div className="flex justify-start gap-4">
                <Image
                  src={`${baseUrl}/delivery/nova_poshta_white.svg`}
                  alt="Нова пошта"
                  width={120}
                  height={30}
                  className="h-[30px] object-contain"
                  priority
                />
                <Image
                  src={`${baseUrl}/delivery/ukr_poshta_white.svg`}
                  alt="Ukrposhta"
                  width={120}
                  height={30}
                  className="h-[30px] object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex-1 text-2xl flex flex-col gap-4">
              <span>Оплата</span>
              <div className="border-b border-primaryAccentColor mb-2" />
              <div className="flex justify-start gap-4">
                <Image
                  src={`${baseUrl}/payment/mastercard_white.svg`}
                  alt="MasterCard"
                  width={120}
                  height={30}
                  className="h-[30px] object-contain"
                  priority
                />
                <Image
                  src={`${baseUrl}/payment/visa_white.svg`}
                  alt="Visa"
                  width={120}
                  height={30}
                  className="h-[30px] object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Інформація, Товари, Категорії */}
          <div className="flex flex-col flex-1 gap-4">
            <span className="text-2xl">Інформація</span>
            <div className="border-b border-primaryAccentColor" />
            {renderLinksList(infoLinks)}
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <span className="text-2xl">Товари</span>
            <div className="border-b border-primaryAccentColor" />
            {renderLinksList(goodsLinks)}
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <span className="text-2xl">Категорії</span>
            <div className="border-b border-primaryAccentColor" />
            {renderCategoriesList()}
          </div>
        </div>

        {/* Форма зворотного дзвінка */}
        <div className="flex-1 md:max-w-xs mt-4 md:mt-0">
          <LeadForm action={addNewLead} title="Замовити зворотній дзвінок" />
        </div>
      </div>

      <div className="border-b border-primaryAccentColor my-5" />
      <p className="text-center text-sm">
        &copy; 2024 Paro
        <span className="text-primaryAccentColor">Master</span>. Усі права
        захищено.
        <br />
        Створюючи сьогодення, ми формуємо майбутнє разом.
      </p>
    </footer>
  );
};

export default Footer;
