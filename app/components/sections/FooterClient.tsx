'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { addNewLeadAction } from '@/actions/leads';
import { LeadForm } from '@/components/forms';
import { EmptyState, Logo, NextImage, Socials } from '@/components/index';
import { useMediaQuery } from '@/hooks/index';
import { ICategory } from '@/types/index';

const links = [
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

const FooterClient = ({ categories }: { categories: ICategory[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const baseUrl =
    typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_URL || '';
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(name, value) : params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  if (!categories?.length) return <EmptyState showReset />;

  const renderIcons = (icons: { src: string; alt: string }[]) => (
    <div className="flex justify-between gap-2">
      {icons.map(({ src, alt }, i) => (
        <NextImage
          key={i}
          src={`${baseUrl}${src}`}
          alt={alt}
          width={120} // фиксированная ширина
          height={30} // фиксированная высота
          style={{ width: '120px', height: '30px', objectFit: 'contain' }} // CSS точно совпадает с пропсами
          priority
        />
      ))}
    </div>
  );

  const renderLinks = (linksArray: typeof links) => (
    <ul className="text-sm">
      {linksArray.map(({ title, link }, i) => (
        <li
          key={i}
          className="nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200"
        >
          <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderCategories = () => (
    <ul className="text-sm">
      {categories.map(({ src, name }, i) => (
        <li key={i} className="mb-3 nav">
          <Link
            href={`/category/?${createQueryString('category', name)}`}
            className="flex justify-start items-start group"
          >
            <NextImage
              alt={name}
              src={src}
              width={20} // фиксированная ширина
              height={20} // фиксированная высота
              style={{ width: '20px', height: '20px', objectFit: 'contain' }} // CSS совпадает с пропсами
              className="mr-4 transition-filter duration-300 ease-in-out group-hover:filter-primary filter-white"
              priority
            />
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-slate-800 p-8 text-white">
      {/* Logo и Socials */}
      <div className="flex flex-col gap-y-4 md:flex-row justify-between mb-10">
        <Logo color="white" />
        <Socials color="white" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="mb-10">
          {/* Доставка и Оплата */}
          <div className="flex flex-col md:flex-row gap-8 mb-20">
            <div className="w-full md:w-[50%] text-2xl flex flex-col gap-8">
              Доставка
              <div className="border-b border-primaryAccentColor" />
              {renderIcons([
                {
                  src: `${baseUrl}/delivery/nova_poshta_white.svg`,
                  alt: 'Нова пошта',
                },
                {
                  src: `${baseUrl}/delivery/ukr_poshta_white.svg`,
                  alt: 'Ukrposhta',
                },
              ])}
            </div>
            <div className="w-full md:w-[50%] text-2xl flex flex-col gap-8">
              Оплата
              <div className="border-b border-primaryAccentColor" />
              {renderIcons([
                {
                  src: `${baseUrl}/payment/mastercard_white.svg`,
                  alt: 'MasterCard',
                },
                { src: `${baseUrl}/payment/visa_white.svg`, alt: 'Visa' },
              ])}
            </div>
          </div>

          {/* Информация, Товары, Категории */}
          <div
            className={`flex ${isMobile ? 'justify-between' : 'gap-3 md:gap-8 mb-4'}`}
          >
            <div
              className={`${isMobile ? 'w-[45%]' : 'w-[33%]'} text-2xl flex flex-col gap-8`}
            >
              Інформація
              <div className="border-b border-primaryAccentColor" />
              {renderLinks(links)}
              {!isMobile && renderLinks(goodsLinks)}
            </div>
            {isMobile && (
              <div className="w-[45%] text-2xl flex flex-col gap-8">
                Товари
                <div className="border-b border-primaryAccentColor" />
                {renderLinks(goodsLinks)}
              </div>
            )}
            <div
              className={`${isMobile ? 'w-[45%]' : 'w-[33%]'} text-2xl flex flex-col gap-8`}
            >
              Категорії
              <div className="border-b border-primaryAccentColor" />
              {renderCategories()}
            </div>
          </div>
        </div>

        <div id="contactForm" className={`${isMobile ? 'mb-4' : 'mb-0'}`}>
          <LeadForm
            action={addNewLeadAction}
            title="Замовити зворотній дзвінок"
          />
        </div>
      </div>

      {!isMobile && <div className="border-b border-primaryAccentColor mb-5" />}

      <div className="mb-5">
        <p className="text-center">
          &copy; 2024 Paro
          <span className="text-primaryAccentColor">Master</span>. Усі права
          захищено. Створено з ❤️ та інноваціями.
          <br />
          <br />
          Створюючи сьогодення, ми формуємо майбутнє разом.
        </p>
      </div>
    </div>
  );
};

export default FooterClient;
