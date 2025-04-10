import Button from "./Button"

const DeleteConfirmation = ({
  onConfirm,
  onCancel,
  title
}: {
  onConfirm: () => void
  onCancel: () => void
  title?: string
}) => {
  return (
    <div>
      <div className="bg-white p-6 rounded-lg w-full">
        <h3 className="text-lg font-semibold mb-4">Ви впевнені?</h3>
        <p className="mb-4">Ви хочете видалити цей {title}?</p>
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" label="Скасувати" onClick={onCancel} small outline />
          <Button type="button" label="Підтвердити" onClick={onConfirm} small />
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
