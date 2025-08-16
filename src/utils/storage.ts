const STORAGE_KEY = 'tmk__tasks_v1'

export const save = (data: unknown) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const load = <T,>(fallback: T): T => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}