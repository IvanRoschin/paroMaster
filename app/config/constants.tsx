///paymentMethods///

import { OrderStatus } from '@/types/orderStatus';
import { PaymentMethod } from '@/types/paymentMethod';

export const paymentMethods = [
  { id: PaymentMethod.CASH_ON_DELIVERY, label: 'Оплата після отримання' },
  { id: PaymentMethod.CREDIT_CARD, label: 'Оплата на карту' },
  { id: PaymentMethod.INVOICE_FOR_SPD, label: 'Рахунок для СПД' },
  { id: PaymentMethod.WAY_FOR_PAY, label: 'Оплата через WayForPay' },
];

export const orderStatus = [
  { id: OrderStatus.NEW, label: 'Новий' },
  { id: OrderStatus.PROCESSING, label: 'Опрацьовується' },
  { id: OrderStatus.PAID, label: 'Оплачено' },
  { id: OrderStatus.READY_TO_SHIP, label: 'На відправку' },
  { id: OrderStatus.CLOSED, label: 'Закритий' },
];

///Menu///

export const menu = [
  { menuItemName: 'Наші роботи', menuItemLink: '/works' },
  { menuItemName: 'Послуги', menuItemLink: '/services' },
  { menuItemName: 'Доставка', menuItemLink: '/delivery' },
  { menuItemName: 'Гарантія', menuItemLink: '/guarantee' },
  { menuItemName: 'Контакти', menuItemLink: '/contact' },
  { menuItemName: 'Кабінет', menuItemLink: '/dashboard' },
];

///categoryList///

export const categoryList = [
  {
    src: 'category_korpusniDetali',
    title: 'Корпус станції',
  },
  {
    src: 'category_korpusUtuga',
    title: 'Корпус для прасок',
  },
  {
    src: 'category_pidoshvaUtuga',
    title: 'Підошви для прасок',
  },
  {
    src: 'category_platu',
    title: 'Плати керування',
  },
  {
    src: 'category_boiler',
    title: 'Бойлери',
  },
  {
    src: 'category_electroKlapan',
    title: 'Електроклапани',
  },
  {
    src: 'category_nasos',
    title: 'Насоси(помпи)',
  },
  {
    src: 'category_rezervuarVoda',
    title: 'Резервуари для води',
  },
  {
    src: 'category_provoda',
    title: 'Провода та шланги',
  },
  {
    src: 'category_accsecuari',
    title: 'Аксесуари та комплектуючі',
  },
];

///Slides///
export const slides = [
  {
    id: 1,
    src: `${process.env.PUBLIC_URL}/slider/pic_01.webp`,
    title: 'Комплектуючі',
    desc: 'Ви можете замовити Комплектуючі до парогенераторів за комфортними цінами. Відправлення в день замовлення. ',
  },
  {
    id: 2,
    src: `${process.env.PUBLIC_URL}/slider/pic_02.webp`,
    title: 'Ремонт',
    desc: 'До Вашої уваги послуга термінового ремонту парогенераторів.',
  },
  {
    id: 3,
    src: `${process.env.PUBLIC_URL}/slider/pic_03.webp`,
    title: 'Espresso',
    desc: "Espresso is a concentrated form of coffee, served in shots. It's made of two ingredients - finely ground, 100% coffee, and hot water.",
  },
];
