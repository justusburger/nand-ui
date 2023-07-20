import { NodeProps, NodeToolbar, Position, useEdges, useNodes } from 'reactflow'
import useInboundState from '../useInboundState'
import useNodeDataState from '../useNodeDataState'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import { useEffect, useMemo } from 'react'

const READ_ENABLED = 'Read enabled'
const OUTPUT_ENABLED = 'Output enabled'
const inputHandleIds = [
  'd0',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'a0',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  READ_ENABLED,
  OUTPUT_ENABLED,
]
const outputHandleIds = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7']
const numberOfRows = 16
const numberOfBytes = 256
const numberOfColumns = numberOfBytes / numberOfRows
const rows = Array(numberOfRows)
  .fill(true)
  .map((_, i) => i)
const columns = Array(numberOfColumns)
  .fill(true)
  .map((_, i) => i)

function numberToHex(number: number) {
  const result = number.toString(16)
  if (result.length === 1) return `0${result}`
  return result
}

export interface Memory256NodeData {
  state: { [key: number]: number }
}
function Memory256Node({ id }: NodeProps<Memory256NodeData>) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const [state, setState] = useNodeDataState<
    Memory256NodeData,
    { [key: number]: number }
  >(id, 'state', {})
  const inboundStateJSON = JSON.stringify(inboundState)
  const address = useMemo(() => {
    let result = 0
    for (let i = 0; i < 8; i++) {
      const columnValue = Math.pow(2, i)
      if (inboundState[`a${i}`]) result += columnValue
    }
    return result
  }, [inboundStateJSON])

  const inboundData = useMemo(() => {
    let result = 0
    for (let i = 0; i < 8; i++) {
      const columnValue = Math.pow(2, i)
      if (inboundState[`d${i}`]) result += columnValue
    }
    return result
  }, [inboundStateJSON])

  useEffect(() => {
    if (inboundState[READ_ENABLED]) {
      setState({
        ...state,
        [address]: inboundData,
      })
    }
  }, [inboundStateJSON, address, inboundData])

  const outboundData = useMemo(() => {
    const binary = (state[address] >>> 0).toString(2)
    const result: any = {}
    for (let i = 0; i < 8; i++) {
      result[`d${i}`] = parseInt(binary[i] || '0')
    }
    return result
  }, [JSON.stringify(state), address])
  return (
    <NodeContainer>
      <NodeToolbar position={Position.Bottom}>
        <div className="bg-white rounded p-3 text-black tabular-nums shadow-lg shadow-gray-700">
          <table>
            <thead></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  {columns.map((column) => (
                    <DataDisplayCell
                      key={column}
                      column={column}
                      address={row * numberOfRows + column}
                      state={state}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NodeToolbar>
      <InputHandleRegion>
        {inputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            label={handleId}
            enabled={inboundState[handleId]}
            key={handleId}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div style={{ color: 'black', padding: 10 }}>Memory 256 byte</div>
      <OutputHandleRegion>
        {outputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            label={handleId}
            enabled={inboundState[OUTPUT_ENABLED] && outboundData[handleId]}
            key={handleId}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default Memory256Node
interface DataDisplayCellProps {
  column: number
  address: number
  state: { [key: number]: number }
}
function DataDisplayCell({ column, address, state }: DataDisplayCellProps) {
  const value = state[address] || 0
  return (
    <td
      key={column}
      className={
        'px-1 ' +
        (column % 4 === 3 ? 'pr-4 ' : '') +
        (value === 0 ? 'text-gray-300 ' : '')
      }
    >
      {numberToHex(value)}
    </td>
  )
}
