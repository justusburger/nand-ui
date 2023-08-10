import { useEffect, useState } from 'react'
import App from './App'
import throttle from 'lodash.throttle'
import { NODE_TYPES_IDS } from './nodeTypes'
import cloneNodesAndEdges from './cloneNodesAndEdges'

const serveBaseUrl = 'http://localhost:3000'
const nodesUrl = `${serveBaseUrl}/items/nodes`
const edgesUrl = `${serveBaseUrl}/items/edges`
const customNodeTypesUrl = `${serveBaseUrl}/items/customNodeTypes`
const updateDelay = 2000

function cleanNode(node: any) {
  const result = {
    ...node,
  }
  if (result.type === 'custom') {
    result.data = {
      customNodeTypeId: result.data.customNodeTypeId,
    }
  }
  return result
}

const excludeKeys = [
  'selected',
  'sourceNode',
  'selectable',
  'dragging',
  'deletable',
  'focusable',
  'updatable',
  'style',
  'outboundHandleState',
  'animated',
  'width',
  'height',
]
const replacer = (key: string, value: any) => {
  if (excludeKeys.indexOf(key) > -1) return undefined
  return value
}

const saveNodes = throttle(async function saveNodes(nodes: any[]) {
  await fetch(nodesUrl, {
    method: 'PUT',
    body: JSON.stringify({ id: 'nodes', data: nodes.map(cleanNode) }, replacer),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay) as any

function cleanEdge(edge: any) {
  const result = {
    ...edge,
  }
  return result
}

function cleanCustomNodeType(customNodeType: any) {
  const result = {
    ...customNodeType,
    data: {
      ...customNodeType.data,
      edges: customNodeType.data.edges?.map(cleanEdge),
    },
  }
  return result
}

const saveEdges = throttle(async function (edges: any[]) {
  await fetch(edgesUrl, {
    method: 'PUT',
    body: JSON.stringify(
      {
        id: 'edges',
        data: edges.map(cleanEdge),
      },
      replacer
    ),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay) as any

const saveCustomNodeTypes = throttle(async function (customNodeTypes: any[]) {
  await fetch(customNodeTypesUrl, {
    method: 'PUT',
    body: JSON.stringify(
      {
        id: 'customNodeTypes',
        data: customNodeTypes.map(cleanCustomNodeType),
      },
      replacer
    ),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}, updateDelay) as any

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

      const customNodeTypeLookup = (customNodeTypes.data || []).reduce(
        (acc: any, customNodeType: any) => {
          acc[customNodeType.id] = customNodeType
          return acc
        },
        {} as { [key: string]: any }
      )

      setInitialState({
        nodes: (nodes.data || [])
          .map((node: any) => {
            if (node.type === NODE_TYPES_IDS.CUSTOM) {
              const { customNodeTypeId } = node.data
              const nodeType = customNodeTypeLookup[customNodeTypeId]
              if (nodeType) {
                const [initialNodes, initialEdges] = cloneNodesAndEdges(
                  nodeType.data.nodes.map((node: any) => ({
                    ...node,
                    selected: false,
                    selectable: false,
                    deletable: false,
                  })),
                  nodeType.data.edges.map((edge: any) => ({
                    ...edge,
                    selected: false,
                    deletable: false,
                    focusable: false,
                    updatable: false,
                  }))
                )
                node.data = {
                  ...node.data,
                  ...nodeType.data,
                  initialNodes,
                  initialEdges,
                }
              } else {
                return null
              }
            }
            return node
          })
          .filter((n: any) => n),
        edges: (edges.data || []).map((edge: any) => {
          edge.type = 'nodeEdge'
          return edge
        }),
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
