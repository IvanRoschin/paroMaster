import Breadcrumbs from "@/components/Breadcrumbs"
import Logo from "@/components/Logo"
import Link from "next/link"

const PublicOffer = () => {
  return (
    <div className="bg-white text-black p-6">
      <Breadcrumbs />

      <h1 className="text-center text-2xl font-bold mb-8">ПУБЛІЧНА ОФЕРТА</h1>

      <div className="text-center mb-8">
        <p className="mb-2">ІНТЕРНЕТ-МАГАЗИНУ</p>
        <Logo />
      </div>

      <Section title="§ 1 ЗАГАЛЬНІ ПОЛОЖЕННЯ">
        <p className="mb-2">
          {`Ця Публічна оферта є офіційною пропозицією фізичної особи-підприємця `}
          <strong>{process.env.NEXT_PUBLIC_ADMIN_NAME}</strong>
          {` (далі – «Продавець») укласти договір купівлі-продажу товарів дистанційним способом через інтернет-магазин `}
          <strong>{process.env.NEXT_PUBLIC_SITE_NAME}</strong>
          {`, відповідно до умов, викладених у цій Оферті.`}
        </p>
        <p className="mb-2">
          {`Фактичне оформлення замовлення Покупцем на сайті є повним і безумовним прийняттям умов цієї Оферти (акцептом), рівнозначним укладенню письмового договору.`}
        </p>
      </Section>

      <Section title="§ 2 ПРЕДМЕТ ДОГОВОРУ">
        <p className="mb-2">
          {`Продавець зобов'язується передати у власність Покупця товари, представлені в інтернет-магазині, а Покупець – прийняти їх і оплатити на умовах цієї Оферти.`}
        </p>
      </Section>

      <Section title="§ 3 ПОРЯДОК ОФОРМЛЕННЯ ЗАМОВЛЕННЯ">
        <List
          items={[
            "Покупець самостійно оформлює замовлення на Сайті, заповнюючи форму замовлення.",
            "Під час оформлення замовлення Покупець надає достовірну інформацію про себе.",
            "Після оформлення замовлення Покупець отримує підтвердження на електронну пошту або за номером телефону."
          ]}
        />
      </Section>

      <Section title="§ 4 ЦІНА ТА ПОРЯДОК ОПЛАТИ">
        <List
          items={[
            "Ціни на товари вказані в національній валюті та є чинними на момент оформлення замовлення.",
            "Оплата здійснюється способами, зазначеними на Сайті: готівкою при отриманні або безготівковим переказом через платіжні системи."
          ]}
        />
      </Section>

      <Section title="§ 5 ДОСТАВКА ТА ПЕРЕДАЧА ТОВАРУ">
        <List
          items={[
            "Доставка здійснюється транспортними компаніями, вибраними Покупцем при оформленні замовлення.",
            "Ризики випадкової загибелі або пошкодження товару переходять до Покупця з моменту передачі товару перевізнику."
          ]}
        />
      </Section>

      <Section title="§ 6 ПРАВА ТА ОБОВ'ЯЗКИ СТОРІН">
        <p className="mb-2">
          <strong>Покупець має право:</strong>
        </p>
        <List
          items={[
            "Отримувати товар відповідної якості та у встановлений термін.",
            "Відмовитися від товару відповідно до законодавства України."
          ]}
        />
        <p className="mb-2">
          <strong>{`Покупець зобов'язується:`}</strong>
        </p>
        <List
          items={[
            "Надати достовірну інформацію при оформленні замовлення.",
            "Прийняти та оплатити замовлений товар."
          ]}
        />
        <p className="mb-2">
          <strong>Продавець має право:</strong>
        </p>
        <List
          items={[
            "Призупинити або відмовити у виконанні замовлення у разі виявлення недостовірних даних Покупця.",
            "Змінювати умови Оферти без попереднього погодження з Покупцем."
          ]}
        />
      </Section>

      <Section title="§ 7 ПОВЕРНЕННЯ ТОВАРУ">
        <p className="mb-2">
          {`Повернення товару здійснюється відповідно до чинного законодавства України. Покупець має право повернути товар належної якості протягом 14 календарних днів з моменту отримання за умови збереження товарного вигляду та споживчих властивостей.`}
        </p>
      </Section>

      <Section title="§ 8 ВІДПОВІДАЛЬНІСТЬ">
        <p className="mb-2">
          {`Сторони несуть відповідальність за невиконання або неналежне виконання своїх обов'язків за цим Договором відповідно до чинного законодавства України.`}
        </p>
      </Section>

      <Section title="§ 9 ПРИКІНЦЕВІ ПОЛОЖЕННЯ">
        <p className="mb-2">
          {`Усі спори, що виникають у зв'язку з виконанням цієї Оферти, вирішуються шляхом переговорів. У разі недосягнення згоди – у судовому порядку відповідно до чинного законодавства України.`}
        </p>
      </Section>

      <div className="mt-8">
        <p className="mb-2">Контактна інформація Продавця:</p>
        <p className="mb-2">
          <strong>Юридична адреса:</strong> {process.env.NEXT_PUBLIC_ADMIN_ADDRESS}
        </p>
        <p className="mb-2">
          <strong>Електронна пошта:</strong>{" "}
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
            className="hover:text-primaryAccentColor"
          >
            {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
          </a>
        </p>
        <p className="flex items-start mb-2">
          <strong>Телефон:</strong>{" "}
          <Link
            href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
            className="ml-2 hover:text-primaryAccentColor"
          >
            {process.env.NEXT_PUBLIC_ADMIN_PHONE}
          </Link>
        </p>
      </div>
    </div>
  )
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </section>
)

const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc list-inside mb-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

export default PublicOffer
