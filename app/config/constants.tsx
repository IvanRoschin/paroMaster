///Menu///

export const mockGoods = [
  {
    _id: '1a2b3c',
    category: 'Electronics',
    src: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300/?blur',
    ],
    brand: 'BrandA',
    model: 'ModelX',
    vendor: 'Vendor1',
    title: 'Smartphone ModelX',
    description: 'A high-end smartphone with an impressive display and camera.',
    price: 699.99,
    isAvailable: true,
    isCompatible: true,
    compatibility: 'Universal',
    quantity: 50,
  },
  {
    _id: '2d3e4f',
    category: 'Appliances',
    src: ['https://picsum.photos/200/300.jpg', 'https://example.com/img4.jpg'],
    brand: 'BrandB',
    model: 'CoolFridge',
    vendor: 'Vendor2',
    title: 'Refrigerator CoolFridge',
    description: 'Energy-efficient refrigerator with a sleek design.',
    price: 899.99,
    isAvailable: true,
    isCompatible: false,
    compatibility: 'N/A',
    quantity: 20,
  },
  {
    _id: '3g4h5i',
    category: 'Furniture',
    src: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/seed/picsum/200/300',
    ],
    brand: 'BrandC',
    model: 'SofaMax',
    vendor: 'Vendor3',
    title: 'Sofa SofaMax',
    description: 'Comfortable and stylish sofa, perfect for any living room.',
    price: 499.99,
    isAvailable: false,
    isCompatible: false,
    compatibility: 'N/A',
    quantity: 0,
  },
  {
    _id: '4j5k6l',
    category: 'Computers',
    src: ['https://example.com/img7.jpg', 'https://example.com/img8.jpg'],
    brand: 'BrandD',
    model: 'UltraBook',
    vendor: 'Vendor4',
    title: 'Laptop UltraBook',
    description:
      'Lightweight and powerful laptop for all your computing needs.',
    price: 1199.99,
    isAvailable: true,
    isCompatible: true,
    compatibility: 'Windows',
    quantity: 30,
  },
  {
    _id: '5m6n7o',
    category: 'Home Improvement',
    src: ['https://example.com/img9.jpg', 'https://example.com/img10.jpg'],
    brand: 'BrandE',
    model: 'DrillPro',
    vendor: 'Vendor5',
    title: 'Power Drill DrillPro',
    description: 'Durable power drill for professional and DIY projects.',
    price: 149.99,
    isAvailable: true,
    isCompatible: true,
    compatibility: 'Universal',
    quantity: 100,
  },
];

export const menu = [
  { menuItemName: 'Наші роботи', menuItemLink: '/ourworks' },
  { menuItemName: 'Послуги', menuItemLink: '/services' },
  { menuItemName: 'Доставка', menuItemLink: '/delivery' },
  { menuItemName: 'Гарантія', menuItemLink: '/guarantee' },
  { menuItemName: 'Контакти', menuItemLink: '/contact' },
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
