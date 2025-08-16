import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TaskProvider } from '@store/TaskContext'
import { ModalProvider } from '@modules/modal/ModalContext'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaskProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </TaskProvider>
  </React.StrictMode>,
)