import CartModal from "../modals/CartModal"

export function ShoppingCart({
  isOpen
  // isOrderModalOpen
}: {
  isOpen: boolean
  // isOrderModalOpen: boolean
}) {
  return (
    <>
      <CartModal isOpen={isOpen} />
      {/* <OrderModal isOrderModalOpen={isOrderModalOpen} /> */}
    </>
  )
}

export default ShoppingCart
