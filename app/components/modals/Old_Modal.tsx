"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"
import Button from "../Button"

interface ModalProps {
  title?: string
  actionLabel: string
  secondaryAction?: () => void
  secondaryActionLabel?: string
  body?: JSX.Element
  footer?: JSX.Element
  isOpen?: boolean
  onClose: () => void
  onSubmit: () =>
    | Promise<void>
    | void
    | {
        success: boolean
        message: string
      }
  disabled?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel
}) => {
  const [showModal, setShowModal] = useState(isOpen)
  const ref = useRef<HTMLDivElement>(null)

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

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return
    }
    onSubmit()
  }, [disabled, onSubmit])

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }
    secondaryAction()
  }, [disabled, secondaryAction])

  if (!isOpen) {
    return null
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="
      justify-center
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
        ref={ref}
        className="
          relative 
          w-full 
          md:w-4/6 
          lg:w-3/6 
          xl:w-3/5
          mx-auto 
          lg:h-auto 
          md:h-auto
        "
      >
        {/* Content*/}
        <div
          className={`translate duration-300  ${
            showModal ? "translate-x-0" : "translate-x-[50%]"
          } ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="
            translate
            border-0
            rounded-lg
            shadow-lg
            relative
            flex
            flex-col
            w-full
            bg-white
            outline-none
            focus:outline-none
						"
          >
            {/* Header*/}
            <div
              className="
              flex 
              items-center 
              p-8
              border-nuatral:800 
              justify-center
              relative
              border-[1px]"
            >
              <div className="text-lg font-semibold">{title}</div>
              <button
                onClick={handleClose}
                className="
                  p-1 
                  border-[1px] 
                  rounded-full 
                  border-neutral-600 
                  hover:opacity-70 
                  transition 
                  absolute 
                  right-9
									hover:border-primaryAccentColor
									"
              >
                <IoMdClose size={18} />
              </button>
            </div>
            {/*Body */}
            <div
              className=" p-6 flex-auto"
              style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}
            >
              {body}
            </div>
            {/**Footer */}
            <div className="flex flex-col gap-2 p-6">
              <div
                className="
                flex 
                flex-row 
                items-center 
                gap-4
                w-full"
              >
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                  />
                )}
                <Button
                  type="submit"
                  disabled={disabled}
                  label={actionLabel}
                  onClick={handleSubmit}
                />
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
