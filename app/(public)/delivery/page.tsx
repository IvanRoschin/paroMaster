import { generateMetadata } from '@/app/helpers/generateMetadata';
import { Breadcrumbs } from '@/components';

export const metadata = generateMetadata({
  title: 'Оплата та доставка | ParoMaster',
  description:
    'Детальна інформація про оплату та доставку товарів і послуг ParoMaster. Оплата готівкою, безготівково або при отриманні. Безкоштовна доставка при замовленні від 1000 грн.',
  keywords: [
    'доставка ParoMaster',
    'оплата ParoMaster',
    'умови доставки',
    'оплата при отриманні',
    'безготівковий розрахунок',
    'Нова Пошта доставка',
    'Укрпошта доставка',
    'безкоштовна доставка',
    'як оформити замовлення',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/delivery`,
      title: 'Оплата та доставка | Умови замовлення ParoMaster',
      description:
        'Дізнайтесь, як оплатити замовлення та отримати доставку від ParoMaster. Зручні способи оплати та швидка доставка по Україні від Нової Пошти та Укрпошти.',
    },
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/delivery`,
    },
  },
  imageUrl: '/services/04.webp',
  imageAlt: 'Інформація про оплату та доставку ParoMaster',
});

const DeliveryPage = () => {
  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />

      <h2 className="subtitle mb-4 text-center">Оплата та Доставка</h2>
      <section className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="subtitle">Оплата</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-lg text-gray-700">
            <strong>Безготівковий розрахунок:</strong> Здійсніть оплату через
            банківський переказ або платіжні системи.
          </li>
          <li className="text-lg text-gray-700">
            <strong>Передплата:</strong> Можлива оплата замовлення повністю або
            частково перед відправкою.
          </li>
          <li className="text-lg text-gray-700">
            <strong>Оплата при отриманні:</strong> Оплатіть ваше замовлення на
            відділенні Нової Пошти.
          </li>
        </ul>
      </section>

      <section className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="subtitle">Доставка</h3>
        <p className="text-lg text-gray-700 mb-4">
          Доставка здійснюється надійними операторами:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li className="text-lg text-gray-700">Укрпошта</li>
          <li className="text-lg text-gray-700">Нова Пошта</li>
        </ul>
        <p className="text-lg text-gray-700">
          При замовленні на суму більше <strong>1000 грн</strong>, доставка буде
          безкоштовною.
        </p>
      </section>

      <section className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="subtitle">Як оформити замовлення</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li className="text-lg text-gray-700">
            Оберіть товари, які вас цікавлять, та додайте їх у кошик.
          </li>
          <li className="text-lg text-gray-700">
            Перейдіть до оформлення замовлення, вибравши зручний вам спосіб
            оплати.
          </li>
          <li className="text-lg text-gray-700">Вкажіть адресу доставки.</li>
          <li className="text-lg text-gray-700">
            Підтвердіть замовлення, і ми відправимо його Вам у найкоротші
            терміни!
          </li>
        </ol>
      </section>
    </div>
  );
};

export default DeliveryPage;
