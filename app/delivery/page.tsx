type Props = {}

const DeliveryPage = (props: Props) => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="title mb-1">Оплата та Доставка</h2>
      <section className="mb-8">
        <h3 className="subtitle">Оплата</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-lg text-gray-700">
            <strong>Безготівковий розрахунок:</strong> Здійсніть оплату через банківський переказ
            або платіжні системи.
          </li>
          <li className="text-lg text-gray-700">
            <strong>Передплата:</strong> Можлива оплата замовлення повністю або частково перед
            відправкою.
          </li>
          <li className="text-lg text-gray-700">
            <strong>Оплата при отриманні:</strong> Оплатіть ваше замовлення на відділенні Нової
            Пошти.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="subtitle">Доставка</h3>
        <p className="text-lg text-gray-700 mb-4">Доставка здійснюється надійними операторами:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li className="text-lg text-gray-700">Укрпошта</li>
          <li className="text-lg text-gray-700">Нова Пошта</li>
        </ul>
        <p className="text-lg text-gray-700">
          При замовленні на суму більше <strong>1000 грн</strong>, доставка буде безкоштовною.
        </p>
      </section>

      <section className="mt-8">
        <h3 className="subtitle">Як оформити замовлення</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li className="text-lg text-gray-700">
            Оберіть товари, які вас цікавлять, та додайте їх у кошик.
          </li>
          <li className="text-lg text-gray-700">
            Перейдіть до оформлення замовлення, вибравши зручний вам спосіб оплати.
          </li>
          <li className="text-lg text-gray-700">Вкажіть адресу доставки.</li>
          <li className="text-lg text-gray-700">
            Підтвердіть замовлення, і ми відправимо його Вам у найкоротші терміни!
          </li>
        </ol>
      </section>
    </div>
  )
}

export default DeliveryPage
