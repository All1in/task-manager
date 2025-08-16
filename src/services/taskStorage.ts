import { Task } from '../types/task';

const KEY = 'tm_tasks_v1';

export const taskStorage = {
  load(): Task[] {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  },
  save(tasks: Task[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }
};
