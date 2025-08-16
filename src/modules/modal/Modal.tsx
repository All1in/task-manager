import React from 'react'
import { createPortal } from 'react-dom'
import cn from 'classnames'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  if (!open) return null
  const root = document.getElementById('modal-root') as HTMLElement
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'absolute left-1/2 top-1/2 w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    root,
  )
}