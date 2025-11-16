'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { addNewLeadAction } from '@/actions/leads';
import { LeadForm } from '@/components/forms';
import { EmptyState, Logo, Socials } from '@/components/index';
import { useMediaQuery } from '@/hooks/index';
import { ICategory } from '@/types/index';

const links = [
  {
    title: 'Оплата та доставка',
    link: 'delivery',
  },
  {
    title: 'Послуги та сервіси',
    link: 'services',
  },
  {
    title: 'Гарантія',
    link: 'guarantee',
  },
  {
    title: 'Контакти',
    link: 'contact',
  },
  {
    title: 'Політика Конфіденційності',
    link: 'privacypolicy',
  },
  {
    title: 'Публічна Оферта',
    link: 'publicoffer',
  },
];

const goodsLinks = [
  {
    title: 'Популярні товари',
    link: 'populargoods',
  },
  {
    title: 'Акції та знижки',
    link: '/',
  },
];

const FooterClient = ({ categories }: { categories: ICategory[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const baseUrl =
    typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_URL || '';

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Handle errors
  if (!categories?.length) {
    return <EmptyState showReset />;
  }

  return (
    <div className="bg-slate-800 p-8 text-white">
      <div className="flex flex-col gap-y-4 md:flex-row justify-between mb-10 ">
        <Logo color="white" />
        <Socials color="white" />
      </div>
      <div className="flex flex-col lg:flex-row  justify-between gap-10">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-8 mb-20">
            <div className="w-full md:w-[50%]  text-2xl flex flex-col gap-8">
              Доставка
              <div className="border-b border-primaryAccentColor" />
              <div className="flex justify-between">
                <Image
                  src={`${baseUrl}/delivery/nova_poshta_white.svg`}
                  alt="Нова пошта"
                  width={120}
                  height={30}
                  className="h-[30px] object-fit"
                  priority={true}
                />
                <Image
                  src={`${baseUrl}/delivery/ukr_poshta_white.svg`}
                  alt="Ukrposhta"
                  width={120}
                  height={30}
                  className="h-[30px] object-fit"
                  priority={true}
                />
              </div>
            </div>
            <div className="w-full md:w-[50%] text-2xl flex flex-col gap-8">
              Оплата
              <div className="border-b border-primaryAccentColor" />
              <div className="flex justify-between">
                <Image
                  src={`${baseUrl}/payment/mastercard_white.svg`}
                  alt="MasterCard"
                  width={120}
                  height={30}
                  className="h-[30px] object-fit"
                  priority={true}
                />
                <Image
                  src={`${baseUrl}/payment/visa_white.svg`}
                  alt="Visa"
                  width={120}
                  height={30}
                  className="h-[30px] object-fit"
                  priority={true}
                />
              </div>
            </div>
          </div>
          {isMobile ? (
            <div className="flex justify-between">
              <div className="w-[45%] text-2xl flex flex-col gap-8">
                <div>
                  Інформація
                  <div className="border-b border-primaryAccentColor" />
                  <ul className="text-sm">
                    {links.map((item, index) => (
                      <li
                        key={index}
                        className="nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200"
                      >
                        <Link
                          href={`/${item.link.toLowerCase().replace(/ /g, '-')}`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  Товари
                  <div className="border-b border-primaryAccentColor" />
                  <ul className="text-sm">
                    {goodsLinks.map((item, index) => (
                      <li
                        key={index}
                        className="nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200"
                      >
                        <Link
                          href={`/${item.link.toLowerCase().replace(/ /g, '-')}`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-[45%] text-2xl flex flex-col">
                Категорії
                <div className="border-b border-primaryAccentColor" />
                <ul className="text-sm">
                  {categories?.map(({ src, name }, index) => (
                    <li key={index} className="mb-3 nav">
                      <Link
                        href={`/category/?${createQueryString('category', name)}`}
                        className="flex justify-start items-start group"
                      >
                        <Image
                          alt={name}
                          src={src}
                          width={20}
                          height={20}
                          className="w-5 h-5 mr-3 transition-filter duration-300 ease-in-out group-hover:filter-primary filter-white"
                          priority={true}
                        />
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 md:gap-8 mb-4">
              <div className="w-[33%] text-2xl flex flex-col gap-8">
                Інформація
                <div className="border-b border-primaryAccentColor" />
                <ul className="text-sm">
                  {links.map((item, index) => (
                    <li
                      key={index}
                      className="nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200"
                    >
                      <Link
                        href={`/${item.link.toLowerCase().replace(/ /g, '-')}`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-[33%] text-2xl flex flex-col gap-8">
                Товари
                <div className="border-b border-primaryAccentColor" />
                <ul className="text-sm">
                  {goodsLinks.map((item, index) => (
                    <li
                      key={index}
                      className="nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200"
                    >
                      <Link
                        href={`/${item.link.toLowerCase().replace(/ /g, '-')}`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-[33%] text-2xl flex flex-col gap-8">
                Категорії
                <div className="border-b border-primaryAccentColor" />
                <ul className="text-sm">
                  {categories?.map(({ src, name }, index) => (
                    <li key={index} className="mb-3 nav">
                      <Link
                        href={`/category/?${createQueryString('category', name)}`}
                        className="flex justify-start items-start group"
                      >
                        <Image
                          alt={name}
                          src={src}
                          width={20}
                          height={20}
                          className="w-5 h-5 mr-3 transition-filter duration-300 ease-in-out group-hover:filter-primary filter-white"
                        />
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
