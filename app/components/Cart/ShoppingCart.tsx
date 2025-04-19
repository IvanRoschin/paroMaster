import useCartModal from "@/hooks/useCartModal"
import { useRouter } from "next/navigation"
import Modal from "../modals/Modal"
import CartClient from "./CartClient"

export function ShoppingCart() {
  const cartModal = useCartModal()
  const { push } = useRouter()

  const onConfirm = () => {
    cartModal.onClose()
    push("/order")
  }

  return (
    <>
      <Modal
        isOpen={cartModal.isOpen}
        onClose={cartModal.onClose}
        body={<CartClient onConfirm={onConfirm} onCancel={() => cartModal.onClose()} />}
      />
    </>
  )
}

export default ShoppingCart
