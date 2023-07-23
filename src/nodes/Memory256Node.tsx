import { NodeProps, NodeToolbar, Position, useEdges, useNodes } from 'reactflow'
import useInboundState from '../useInboundState'
import useNodeDataState from '../useNodeDataState'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useOutboundState from '../useOutboundState'

const READ_ENABLED = 'Read enabled'
const OUTPUT_ENABLED = 'Output enabled'
const numberOfDataBits = 8
const numberOfAddressBits = 8
const outputHandleIds = new Array(numberOfDataBits)
  .fill(true)
  .map((_, i) => `d${i}`)
const addressHandleIds = new Array(numberOfAddressBits)
  .fill(true)
  .map((_, i) => `a${i}`)
const inputHandleIds = [
  ...outputHandleIds,
  ...addressHandleIds,
  READ_ENABLED,
  OUTPUT_ENABLED,
]
const numberOfBytes = Math.pow(2, numberOfAddressBits)
const addresses = new Array(numberOfBytes).fill(true).map((_, i) => i)

function numberToHex(number: number) {
  if (!number) return '00'
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
  const selectedAddress = useMemo(() => {
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
        [selectedAddress]: inboundData,
      })
    }
  }, [inboundStateJSON, selectedAddress, inboundData])

  const outboundData = useMemo(() => {
    const binary = (state[selectedAddress] >>> 0).toString(2).padStart(8, '0')
    const result: any = {}
    if (inboundState[OUTPUT_ENABLED]) {
      for (let i = 0; i < 8; i++) {
        result[`d${i}`] = parseInt(binary[i] || '0')
      }
    }
    return result
  }, [JSON.stringify(state), selectedAddress, inboundState[OUTPUT_ENABLED]])

  useOutboundState(id, outboundData)

  const handleCellValueChange = useCallback(
    (address: number, value: number) => {
      setState({
        ...state,
        [address]: value,
      })
    },
    [state]
  )

  return (
    <NodeContainer>
      <NodeToolbar position={Position.Bottom}>
        <div className="bg-white rounded pt-3 pb-3 pl-3 text-gray-500 tabular-nums shadow-lg shadow-gray-700">
          <div className="flex mb-4">
            <div className="text-lg font-bold">Memory content</div>
          </div>
          <div
            className="flex"
            style={{ maxHeight: 650, overflowY: 'scroll', overflowX: 'hidden' }}
          >
            <div className="tabular-nums text-left text-2xl pt-2 pr-2">
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th className="text-xs pr-2 pb-2">Address</th>
                    <th className="text-xs pr-2 pb-2"></th>
                    <th className="text-xs pr-2 pb-2 pl-2">Binary</th>
                    <th className="text-xs pr-2 pb-2 pl-4">Hex</th>
                    <th className="text-xs pr-2 pb-2 pl-2">Decimal</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address) => (
                    <MemoryCellEditor
                      key={address}
                      address={address}
                      value={state[address]}
                      onChange={handleCellValueChange}
                      addressSelected={selectedAddress === address}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

interface MemoryCellEditorProps {
  address: number
  value: number
  onChange: (address: number, value: number) => void
  addressSelected: boolean
}

function MemoryCellEditor({
  address,
  value,
  onChange,
  addressSelected,
}: MemoryCellEditorProps) {
  const [binary, setBinary] = useState('')
  useEffect(() => {
    setBinary((value >>> 0).toString(2).padStart(8, '0'))
  }, [value])
  const handleOnChange = useCallback((e: any) => {
    setBinary(e.target.value.replace(/[^0-1]/, ''))
  }, [])
  const handleBlur = useCallback(
    (e: any) => {
      let newValue = parseInt(e.target.value, 2)
      if (isNaN(newValue)) newValue = 0
      onChange(address, newValue)
    },
    [onChange, address]
  )
  return (
    <tr
      key={address}
      className={'text-gray-500 ' + (addressSelected ? 'bg-slate-300' : '')}
    >
      <td className={'pr-2 text-sm ' + (value ? '' : 'opacity-30')}>
        <div className="text-right">{address}</div>
      </td>
      <td className={'text-sm px-2 ' + (value ? '' : 'opacity-30')}>
        {(address >>> 0).toString(2).padStart(8, '0')}
      </td>
      <td className="py-1">
        <input
          type="text"
          style={{ width: 175, letterSpacing: 5 }}
          className={
            'tabular-nums bg-gray-100 px-2 py-0 rounded focus:opacity-100 ' +
            (value ? '' : 'opacity-30')
          }
          value={binary}
          onChange={handleOnChange}
          onBlur={handleBlur}
          maxLength={8}
        />
      </td>
      <td className={'px-4 ' + (value ? '' : 'opacity-30')}>
        {numberToHex(value)}
      </td>
      <td className={'pl-2 ' + (value ? '' : 'opacity-30')}>{value || 0}</td>
    </tr>
  )
}
