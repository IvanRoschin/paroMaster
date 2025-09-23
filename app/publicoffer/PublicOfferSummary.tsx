import Link from 'next/link';

const PublicOfferSummary = () => {
  return (
    <div className="bg-gray-100 p-4 text-sm rounded">
      <p className="mb-2">
        Оформлюючи замовлення, ви погоджуєтесь з умовами{' '}
        <Link
          href="/publicoffer"
          className="text-primaryAccentColor underline hover:no-underline"
        >
          Публічної оферти
        </Link>
        .
      </p>
      <p>
        Основні умови: товар передається після повної оплати, доставка — обраною
        службою, повернення — упродовж 14 днів.
      </p>
    </div>
  );
};

export default PublicOfferSummary;
