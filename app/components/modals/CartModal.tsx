"use client"

import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useRouter } from "next/navigation"
import Modal from "./Old_Modal"

interface CartModalProps {
  isOpen: boolean
}

const CartModal: React.FC<CartModalProps> = ({ isOpen }) => {
  const { closeCart } = useShoppingCart()
  const { push } = useRouter()

  const handleOrderSubmit = () => {
    closeCart()
    push("/order")
  }

  const bodyContent = <div className="flex flex-col gap-4">{/* <CartClient /> */}</div>

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
    </div>
  )

  return (
    <Modal
      title="Корзина товарів"
      actionLabel="Оформити замовлення"
      secondaryAction={closeCart}
      secondaryActionLabel="Продовжити покупки"
      body={bodyContent}
      footer={footerContent}
      isOpen={isOpen}
      onClose={closeCart}
      onSubmit={handleOrderSubmit}
    />
  )
}

export default CartModal
