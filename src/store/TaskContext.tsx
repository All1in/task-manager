import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { Task, TaskStatus, User } from '../types/task'
import { load, save } from '../utils/storage'
import { v4 as uuid } from 'uuid'

interface TaskState {
  tasks: Task[]
  users: User[]
}

// demo users
const demoUsers: User[] = [
  { id: uuid(), name: 'Bogdan H.', role: 'Frontend' },
  { id: uuid(), name: 'Iryna S.', role: 'Designer' },
  { id: uuid(), name: 'Marko P.', role: 'QA' },
  { id: uuid(), name: 'Olena K.', role: 'PM' },
]

const initialState: TaskState = load<TaskState>({ tasks: [], users: demoUsers })

type Action =
  | { type: 'add'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'update'; payload: Task }
  | { type: 'move'; payload: { id: string; status: TaskStatus; index?: number } }
  | { type: 'remove'; payload: { id: string } }

const reducer = (state: TaskState, action: Action): TaskState => {
  switch (action.type) {
    case 'add': {
      const now = new Date().toISOString()
      const task: Task = { id: uuid(), createdAt: now, updatedAt: now, ...action.payload }
      const next = { ...state, tasks: [task, ...state.tasks] }
      save(next)
      return next
    }
    case 'update': {
      const next = {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...action.payload } : t)),
      }
      save(next)
      return next
    }
    case 'move': {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (idx === -1) return state
      const copy = [...state.tasks]
      const task = { ...copy[idx], status: action.payload.status, updatedAt: new Date().toISOString() }
      copy.splice(idx, 1)
      if (typeof action.payload.index === 'number') copy.splice(action.payload.index, 0, task)
      else copy.unshift(task)
      const next = { ...state, tasks: copy }
      save(next)
      return next
    }
    case 'remove': {
      const next = { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload.id) }
      save(next)
      return next
    }
    default:
      return state
  }
}

interface Ctx extends TaskState {
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (t: Task) => void
  moveTask: (id: string, status: TaskStatus, index?: number) => void
  removeTask: (id: string) => void
}

const TaskContext = createContext<Ctx | null>(null)

export const TaskProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      addTask: (t) => dispatch({ type: 'add', payload: t }),
      updateTask: (t) => dispatch({ type: 'update', payload: t }),
      moveTask: (id, status, index) => dispatch({ type: 'move', payload: { id, status, index } }),
      removeTask: (id) => dispatch({ type: 'remove', payload: { id } }),
    }),
    [state],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}


