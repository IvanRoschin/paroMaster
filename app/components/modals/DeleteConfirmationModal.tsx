import Button from "../Button"

type Props = {}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[300px]">
        <h3 className="text-lg font-semibold mb-4">Ви впевнені?</h3>
        <p className="mb-4">Ви хочете видалити цей {title}?</p>
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" label="Скасувати" onClick={onClose} small outline />
          <Button type="button" label="Підтвердити" onClick={onConfirm} small />
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
