import React from 'react'
import { useDroppable } from '@dnd-kit/core'

const Column: React.FC<React.PropsWithChildren<{ title: string; id: string }>> = ({ title, id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="flex min-h-[200px] flex-1 flex-col gap-3 rounded-2xl bg-slate-100 p-3">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <div className={isOver ? 'rounded-xl border-2 border-dashed border-blue-400 p-2' : 'space-y-3'}>
        {children}
      </div>
    </div>
  )
}

export default Column