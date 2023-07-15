import { useEffect, useState } from 'react'
import App from './App'
import throttle from 'lodash.throttle'

const serveBaseUrl = 'http://localhost:3000'
const nodesUrl = `${serveBaseUrl}/items/nodes`
const edgesUrl = `${serveBaseUrl}/items/edges`
const customNodeTypesUrl = `${serveBaseUrl}/items/customNodeTypes`
const updateDelay = 2000

const saveNodes = throttle(async function saveNodes(nodes: any[]) {
  console.log('Updating nodes')
  await fetch(nodesUrl, {
    method: 'PUT',
    body: JSON.stringify({ id: 'nodes', data: nodes }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay)

const saveEdges = throttle(async function (edges: any[]) {
  await fetch(edgesUrl, {
    method: 'PUT',
    body: JSON.stringify({ id: 'edges', data: edges }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay)

const saveCustomNodeTypes = throttle(async function (customNodeTypes: any[]) {
  await fetch(customNodeTypesUrl, {
    method: 'PUT',
    body: JSON.stringify({ id: 'customNodeTypes', data: customNodeTypes }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay)

interface InitialState {
  nodes: any[]
  edges: any[]
  customNodeTypes: any[]
}

function ServerStateProvider() {
  const [initialState, setInitialState] = useState<InitialState>()
  useEffect(() => {
    async function load() {
      const nodesPromise = fetch(nodesUrl).then((req) => req.json())
      const edgesPromise = fetch(edgesUrl).then((req) => req.json())
      const customNodeTypesPromise = fetch(customNodeTypesUrl).then((req) =>
        req.json()
      )

      const [nodes, edges, customNodeTypes] = await Promise.all([
        nodesPromise,
        edgesPromise,
        customNodeTypesPromise,
      ])

      setInitialState({
        nodes: nodes.data || [],
        edges: edges.data || [],
        customNodeTypes: customNodeTypes.data || [],
      })
    }
    load().catch(console.error)
  }, [])

  if (initialState)
    return (
      <App
        initialNodes={initialState.nodes}
        saveNodes={saveNodes}
        initialEdges={initialState.edges}
        saveEdges={saveEdges}
        initialCustomNodeTypes={initialState.customNodeTypes}
        saveCustomNodeTypes={saveCustomNodeTypes}
      />
    )

  return <div>Loading</div>
}

export default ServerStateProvider
