import React, { createContext, useContext, useMemo, useState } from 'react'

interface ModalStackState {
  confirm: (msg: string) => Promise<boolean>
}

const ModalContext = createContext<ModalStackState | null>(null)

export const ModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [confirmState, setConfirmState] = useState<{
    msg: string
    resolve?: (v: boolean) => void
  } | null>(null)

  const confirm = (msg: string) =>
    new Promise<boolean>((resolve) => setConfirmState({ msg, resolve }))

  const value = useMemo(() => ({ confirm }), [])

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* very small confirm modal implementation */}
      {confirmState && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow">
            <p className="mb-4 text-slate-800">{confirmState.msg}</p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg border px-4 py-2"
                onClick={() => {
                  confirmState.resolve?.(false)
                  setConfirmState(null)
                }}
              >
                Скасувати
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                onClick={() => {
                  confirmState.resolve?.(true)
                  setConfirmState(null)
                }}
              >
                Підтвердити
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}