"use client"

import { useCallback, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"

interface ModalProps {
  body?: React.ReactElement
  isOpen?: boolean
  onClose: () => void
  disabled?: boolean
}

const Modal = ({ isOpen, onClose, body, disabled }: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen)
  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }
    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [disabled, onClose])

  useEffect(() => {
    const onEscClick = (e: KeyboardEvent) => {
      if (e.code === "Escape") handleClose()
    }

    window.addEventListener("keydown", onEscClick)

    return () => {
      window.removeEventListener("keydown", onEscClick)
    }
  }, [handleClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) handleClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="justify-center
      items-center
      flex
      overflow-x-hidden
      overflow-y-auto
      fixed
      inset-0
      z-50
      outline-none
      focus:outline-none
      bg-neutral-800/70"
    >
      <div
        className={`translate duration-300  ${
          showModal ? "translate-x-0" : "translate-x-[50%]"
        } ${showModal ? "opacity-100" : "opacity-0"} bg-white p-6 rounded-lg w-full md:w-4/6 lg:w-3/6 xl:w-3/5 mx-auto lg:h-auto md:h-auto`}
      >
        <button
          onClick={() => handleClose()}
          className="p-1 border-[1px] rounded-full border-neutral-600 hover:opacity-70 transition absolute right-9 hover:border-primaryAccentColor"
        >
          <IoMdClose size={18} />
        </button>
        {/* Content*/}

        {body}
      </div>
    </div>
  )
}

export default Modal
