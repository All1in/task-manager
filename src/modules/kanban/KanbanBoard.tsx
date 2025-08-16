import React, { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Column from './Column'
import TaskCard from '@modules/tasks/TaskCard'
import TaskFormModal from '@modules/tasks/TaskFormModal'
import { useTasks } from '@store/TaskContext'
import type { Task } from '../../types/task'


const SortableTask: React.FC<{ task: Task; onEdit: (t: Task) => void }> = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  )
}

const KanbanBoard: React.FC = () => {
  const { tasks, moveTask } = useTasks()
  const [editor, setEditor] = useState<{ open: boolean; task?: Task }>({ open: false })

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  )

  const columns = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      inprogress: tasks.filter((t) => t.status === 'inprogress'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks]
  )

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id)
    const overId = e.over?.id as string | undefined
    if (!overId) return

    // Визначаємо колонку, з якої переміщаємо
    const fromCol = Object.entries(columns).find(([_, arr]) => arr.some((t) => t.id === id))
    if (!fromCol) return
    const [fromStatus, fromTasks] = fromCol

    // Якщо overId — це назва колонки (порожня колонка)
    if (['todo', 'inprogress', 'done'].includes(overId)) {
      const toStatus = overId as Task['status']
      moveTask(id, toStatus, 0) // додаємо на початок колонки
      return
    }

    // Інакше overId — це id картки в колонці
    const toCol = Object.entries(columns).find(([_, arr]) => arr.some((t) => t.id === overId))
    if (!toCol) return
    const [toStatus, toTasks] = toCol

    const oldIndex = fromTasks.findIndex((t) => t.id === id)
    const newIndex = toTasks.findIndex((t) => t.id === overId)

    if (fromStatus === toStatus) {
      // Перетасування всередині колонки
      const newTasks = arrayMove(fromTasks, oldIndex, newIndex)
      newTasks.forEach((t, idx) => moveTask(t.id, t.status, idx))
    } else {
      // Переміщення між колонками
      moveTask(id, toStatus as Task['status'], newIndex)
    }
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['todo', 'inprogress', 'done'] as const).map((status) => (
            <Column
              key={status}
              id={status}
              title={
                status === 'todo' ? 'Todo' : status === 'inprogress' ? 'In Progress' : 'Done'
              }
            >
              <SortableContext
                items={columns[status].map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columns[status].map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onEdit={(t) => setEditor({ open: true, task: t })}
                  />
                ))}
              </SortableContext>
            </Column>
          ))}
        </div>
      </DndContext>

      <TaskFormModal
        open={editor.open}
        initial={editor.task}
        onClose={() => setEditor({ open: false })}
      />
    </>
  )
}

export default KanbanBoard



