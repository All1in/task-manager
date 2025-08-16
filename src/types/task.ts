export type TaskStatus = 'todo' | 'inprogress' | 'done'

export interface Attachment {
  name: string
  type: string
  size: number
  dataUrl: string
}

export interface User {
  id: string
  name: string
  avatar?: string
  role?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  assignee?: User | null
  attachment?: Attachment | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}
