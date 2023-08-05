import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ReactFlowProvider } from 'reactflow'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ServerStateProvider from './ServerStateProvider.tsx'
import HandleStateProvider from './components/HandleStateProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <HandleStateProvider>
          <ServerStateProvider />
        </HandleStateProvider>
      </ReactFlowProvider>
    </DndProvider>
  </React.StrictMode>
)
