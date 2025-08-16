import React, { useState } from 'react'
import { TaskProvider } from '@store/TaskContext'
import KanbanBoard from './modules/kanban/KanbanBoard'
import Button from '@components/Button'
import TaskFormModal from '@modules/tasks/TaskFormModal'

const App: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <TaskProvider>
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Task Manager – Kanban</h1>
          <Button onClick={() => setOpen(true)}>Створити задачу</Button>
        </header>

        {/* Kanban з drag&drop */}
        <KanbanBoard />

        {/* Модалка створення/редагування таски */}
        <TaskFormModal open={open} onClose={() => setOpen(false)} initial={{ status: 'todo' }} />
      </div>
    </TaskProvider>
  )
}

export default App
