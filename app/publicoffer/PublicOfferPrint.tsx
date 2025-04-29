import Logo from "@/components/Logo"

const PublicOfferPrint = () => {
  return (
    <div className="p-10 text-black bg-white text-justify font-sans leading-relaxed">
      <div className="text-center mb-8">
        <Logo />
        <h1 className="text-3xl font-bold mt-4">ПУБЛІЧНА ОФЕРТА</h1>
        <p className="mt-2">{`Інтернет-магазину ${process.env.NEXT_PUBLIC_SITE_NAME}`}</p>
      </div>

      <p>
        {`Ця Публічна оферта є офіційною пропозицією фізичної особи-підприємця `}
        <strong>{process.env.NEXT_PUBLIC_ADMIN_NAME}</strong>
        {` укласти договір купівлі-продажу товарів дистанційним способом відповідно до чинного законодавства України.`}
      </p>

      <h2 className="font-semibold mt-6 mb-2">1. Предмет договору</h2>
      <p>
        {`Продавець зобов'язується передати у власність Покупця товари, представлені на сайті, а Покупець — прийняти їх і оплатити.`}
      </p>

      <h2 className="font-semibold mt-6 mb-2">2. Умови оформлення замовлення</h2>
      <p>
        {`Замовлення оформлюються через сайт шляхом заповнення форми із зазначенням особистих даних.`}
      </p>

      <h2 className="font-semibold mt-6 mb-2">3. Ціна і порядок оплати</h2>
      <p>
        {`Ціни вказані у національній валюті. Оплата — готівкою або онлайн через сервіси оплати.`}
      </p>

      <h2 className="font-semibold mt-6 mb-2">4. Доставка і повернення товару</h2>
      <p>
        {`Доставка здійснюється транспортними компаніями. Повернення можливе протягом 14 днів.`}
      </p>

      <h2 className="font-semibold mt-6 mb-2">5. Контактна інформація</h2>
      <p>
        {`Адреса: ${process.env.NEXT_PUBLIC_ADMIN_ADDRESS}`}
        <br />
        {`Електронна пошта: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
        <br />
        {`Телефон: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
      </p>

      <p className="mt-6 text-center italic">
        {`Дякуємо за довіру! Ваші покупки — наша гордість! ❤️`}
      </p>
    </div>
  )
}

export default PublicOfferPrint
