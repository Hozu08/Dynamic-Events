import { Fragment, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChatIA } from './ChatIA.jsx'
import { MinigameTest } from './MinigameTest.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <MinigameTest/>
  </>
)
