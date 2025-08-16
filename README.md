# Task Manager with Kanban Board


This is a modern Task Manager application built with React 18, TypeScript, and Tailwind CSS. It features a fully functional Kanban board with drag-and-drop capabilities, task creation and editing through modals, file attachments, and nested modals for selecting assignees. The application leverages React Context and localStorage for persistent state management.

## Key Features:

### Kanban Board:

1. Columns: Todo, In Progress, Done

2. Drag-and-drop tasks between columns and within the same column

3. Order and status are preserved in localStorage

### Task Creation & Editing Modal:

1. Built with Formik and Yup for form management and validation

2. Fields: Title, Description, Priority, Due Date, File Attachment, Assignee, Status

3. File attachments handled via FileReader as Base64

4. Nested modal for selecting assignees

### Nested Modals:

1. Clicking “Select Assignee” opens a secondary modal without leaving the main task form

2. Data is passed back to the parent form using controlled callbacks (onSelect)

3. Keeps the source of truth inside Formik, avoiding global state for modal communication

### Persistent Storage:

1. Tasks and users are stored in localStorage

2. State management handled by React Context (TaskProvider)

## Technical Stack:

- React 18 + TypeScript

- Tailwind CSS for *styling*

- Formik + Yup for *forms and validation*

- @dnd-kit for *drag-and-drop*

- React Context for *state management*

- ESLint + Prettier + Husky for *code quality and pre-commit checks*

- Vite as the *development environment*


## Project Structure:

```bash
src/
├─ components/       # Reusable UI components (buttons, inputs, modals)
├─ modules/          # Feature-specific logic (tasks, Kanban, users)
├─ types/            # TypeScript types (Task, User, Attachment, etc.)
├─ store/            # React Context providers
├─ utils/            # Utility functions (localStorage helpers, date formatting)
└─ services/         # Optional API or mock services
```


## Development & Setup:

Install dependencies: ```npm install``` or ```yarn```

Run development server: ```npm run dev``` (Vite)

Lint and format code automatically on commit using Husky + lint-staged