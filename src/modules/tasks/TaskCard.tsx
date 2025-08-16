import React from 'react'
import type { Task } from '../../types/task'
import { PriorityTag } from '@components/Tag'
import { useModal } from '@modules/modal/ModalContext'
import { useTasks } from '@store/TaskContext'

interface Props { task: Task; onEdit: (t: Task) => void }

const TaskCard: React.FC<Props> = ({ task, onEdit }) => {
    const { confirm } = useModal()
    const { removeTask } = useTasks()
    return (
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">{task.title}</h4>
              <PriorityTag level={task.priority} />
          </div>
          {task.description && <p className="mb-3 text-sm text-slate-600">{task.description}</p>}
          <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Виконавець: {task.assignee?.name ?? '—'}</span>
              {task.attachment?.name && (
                <a
                  href={task.attachment.dataUrl}
                  download={task.attachment.name}
                  className="truncate underline"
                  title={task.attachment.name}
                >
                    {task.attachment.name}
                </a>
              )}
          </div>
          <div className="mt-3 flex gap-2">
              <button className="rounded-xl border px-3 py-1.5" onClick={() => onEdit(task)}>
                  Редагувати
              </button>
              <button
                className="rounded-xl border px-3 py-1.5 text-rose-600"
                onClick={async () => {
                    const ok = await confirm('Видалити цю задачу?')
                    if (ok) removeTask(task.id)
                }}
              >
                  Видалити
              </button>
          </div>
      </div>
    )
}

export default TaskCard