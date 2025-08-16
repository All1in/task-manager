import React, { useMemo, useState } from 'react'
import { Modal } from '@modules/modal/Modal'
import { useTasks } from '@store/TaskContext'
import type { User } from '../../types/task'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (user: User | null) => void
}

const AssigneeModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { users } = useTasks()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())),
    [users, query],
  )

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-xl font-semibold">Обрати виконавця</h3>
      <input
        type="text"
        placeholder="Пошук користувача..."
        className="mb-4 w-full rounded-xl border px-4 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="max-h-64 space-y-2 overflow-auto">
        {filtered.map((u) => (
          <button
            key={u.id}
            className="flex w-full items-center justify-between rounded-xl border px-4 py-2 hover:bg-slate-50"
            onClick={() => {
              onSelect(u)
              onClose()
            }}
          >
            <span className="font-medium text-slate-800">{u.name}</span>
            <span className="text-sm text-slate-500">{u.role ?? 'Member'}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className="text-sm text-slate-500 underline"
          onClick={() => {
            onSelect(null)
            alert('Виконавця знято')
          }}
        >
          Зняти виконавця
        </button>
        <button className="rounded-xl border px-3 py-1.5" onClick={onClose}>
          Закрити
        </button>
      </div>
    </Modal>
  )
}

export default AssigneeModal