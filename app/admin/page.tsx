type Props = {};

const AdminPage = (props: Props) => {
  return <div>AdminPage</div>;
};

export default AdminPage;

// import { IconType } from 'react-icons';
// import { FaShoppingCart, FaUser } from 'react-icons/fa';
// import { FiPackage } from 'react-icons/fi';
// import { MdBrandingWatermark, MdPayment } from 'react-icons/md';
// import { RiAdminLine } from 'react-icons/ri';
// import { SiTestinglibrary } from 'react-icons/si';
// import { TbCategoryPlus } from 'react-icons/tb';

// import { getAllBrands } from '@/actions/brands';
// import { getAllCategories } from '@/actions/categories';
// import { getAllCustomers } from '@/actions/customers';
// import { getAllGoods } from '@/actions/goods';
// import { getAllOrders } from '@/actions/orders';
// import { getAllTestimonials } from '@/actions/testimonials';
// import { getAllUsers } from '@/actions/users';
// import { Card } from '@/admin/components';

// // app/admin/page.tsx (Server Component)

// interface CardData {
//   title: string;
//   count: number;
//   link: string;
//   icon: IconType;
// }

// export default async function Admin() {
//   // Получаем данные с сервера
//   const [users, customers, orders, goods, categories, brands, testimonials] =
//     await Promise.all([
//       getAllUsers({}),
//       getAllCustomers({}),
//       getAllOrders({}),
//       getAllGoods({}),
//       getAllCategories({}),
//       getAllBrands({}),
//       getAllTestimonials({}),
//     ]);

//   const cardData: CardData[] = [
//     {
//       title: 'Адміністратори',
//       count: users.count,
//       link: '/admin/users',
//       icon: RiAdminLine,
//     },
//     {
//       title: 'Клієнти',
//       count: customers.count,
//       link: '/admin/customers',
//       icon: FaUser,
//     },
//     {
//       title: 'Замовлення',
//       count: orders.count,
//       link: '/admin/orders',
//       icon: FaShoppingCart,
//     },
//     {
//       title: 'Товари',
//       count: goods.count,
//       link: '/admin/goods',
//       icon: FiPackage,
//     },
//     {
//       title: 'Категорії',
//       count: categories.count,
//       link: '/admin/categories',
//       icon: TbCategoryPlus,
//     },
//     {
//       title: 'Бренди',
//       count: brands.count,
//       link: '/admin/brands',
//       icon: MdBrandingWatermark,
//     },
//     {
//       title: 'Відгуки',
//       count: testimonials.count,
//       link: '/admin/testimonials',
//       icon: SiTestinglibrary,
//     },
//     { title: 'Платежі', count: 4, link: '/admin/payments', icon: MdPayment }, // пример, если нет запроса
//   ];

//   return (
//     <div className="m-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {cardData.map(data => (
//           <Card
//             key={data.title}
//             title={data.title}
//             count={data.count}
//             icon={data.icon}
//             link={data.link}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
