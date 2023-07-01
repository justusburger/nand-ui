import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ReactFlowProvider } from 'reactflow'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ServerStateProvider from './ServerStateProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <ServerStateProvider />
      </ReactFlowProvider>
    </DndProvider>
  </React.StrictMode>
)
