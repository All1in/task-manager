import React, { useMemo, useState } from 'react'
import { Modal } from '@modules/modal/Modal'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import type { Attachment, Task, TaskStatus, User } from '../../types/task'
import Button from '@components/Button'
import AssigneeModal from '@modules/users/AssigneeModal'
import { useTasks } from '@store/TaskContext'
import { format } from 'date-fns'

interface Props {
  open: boolean
  onClose: () => void
  initial?: Partial<Task> & { status: TaskStatus }
}

const schema = Yup.object({
  title: Yup.string().required('Вкажіть назву'),
  description: Yup.string().max(1000, 'Занадто довгий опис'),
  priority: Yup.mixed<'low' | 'medium' | 'high'>().oneOf(['low', 'medium', 'high']).required(),
  dueDate: Yup.string().nullable(true),
})

const toDateInput = (iso?: string) => (iso ? format(new Date(iso), 'yyyy-MM-dd') : '')

const TaskFormModal: React.FC<Props> = ({ open, onClose, initial }) => {
  const { addTask, updateTask } = useTasks()
  const [assigneeOpen, setAssigneeOpen] = useState(false)

  const isEdit = Boolean(initial?.id)

  const initValues = useMemo(
    () => ({
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      priority: initial?.priority ?? 'medium',
      dueDate: toDateInput(initial?.dueDate),
      assignee: (initial?.assignee as User | null) ?? null,
      attachment: (initial?.attachment as Attachment | null) ?? null,
      status: initial?.status ?? 'todo',
    }),
    [initial],
  )

  // Підхід: для передачі даних між модалками (nested modal) ми використовуємо callback `onSelect`.
  // TaskFormModal відкриває AssigneeModal як вкладену модалку. Коли користувач обраний,
  // викликається onSelect(user), і дані записуються у Formik через setFieldValue('assignee', user).
  // Таким чином, джерело правди залишається у формі TaskFormModal (Formik),
  // без необхідності глобального state або менеджера модалок.


  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-xl font-semibold">{isEdit ? 'Редагувати' : 'Створити'} задачу</h3>
      <Formik
        initialValues={initValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={(values) => {
          const base = {
            title: values.title,
            description: values.description,
            priority: values.priority,
            dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
            assignee: values.assignee,
            attachment: values.attachment,
            status: values.status,
          }
          if (isEdit && initial?.id) {
            updateTask({ ...initial, ...base, id: initial.id, updatedAt: new Date().toISOString() } as Task)
          } else {
            addTask({ ...base, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Task)
          }
          onClose()
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Назва *</label>
              <Field name="title" className="w-full rounded-xl border px-4 py-2" />
              <ErrorMessage name="title" component="div" className="mt-1 text-sm text-rose-600" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Опис</label>
              <Field
                name="description"
                as="textarea"
                rows={4}
                className="w-full rounded-xl border px-4 py-2"
              />
              <ErrorMessage name="description" component="div" className="mt-1 text-sm text-rose-600" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Пріоритет</label>
                <Field as="select" name="priority" className="w-full rounded-xl border px-4 py-2">
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </Field>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Термін</label>
                <Field type="date" name="dueDate" className="w-full rounded-xl border px-4 py-2" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Файл</label>
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0]
                  if (!file) return setFieldValue('attachment', null)
                  const reader = new FileReader()
                  reader.onload = () => {
                    const dataUrl = reader.result as string
                    const att: Attachment = { name: file.name, size: file.size, type: file.type, dataUrl }
                    setFieldValue('attachment', att)
                  }
                  reader.readAsDataURL(file)
                }}
              />
              {values.attachment && (
                <div className="mt-2 text-sm text-slate-600">
                  Обрано: {values.attachment.name} ({Math.round(values.attachment.size / 1024)} KB)
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Виконавець</label>
              <div className="flex items-center gap-3">
                <div className="min-h-[2.5rem] flex-1 rounded-xl border px-4 py-2">
                  {values.assignee?.name ?? 'Не обрано'}
                </div>
                <Button type="button" variant="ghost" onClick={() => setAssigneeOpen(true)}>
                  Обрати виконавця
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Колонка</label>
              <Field as="select" name="status" className="w-full rounded-xl border px-4 py-2">
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </Field>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Скасувати
              </Button>
              <Button type="submit">{isEdit ? 'Зберегти' : 'Створити'}</Button>
            </div>

            <AssigneeModal
              open={assigneeOpen}
              onClose={() => setAssigneeOpen(false)}
              onSelect={(user) => setFieldValue('assignee', user)}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default TaskFormModal