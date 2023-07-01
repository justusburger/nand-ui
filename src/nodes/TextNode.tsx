import { NodeProps, NodeToolbar, Position } from 'reactflow'
import useNodeDataState from '../useNodeDataState'
import { useCallback, useState } from 'react'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

interface TextNodeData {
  text: string
  fontSize: number
}

const fontSizes = [10, 12, 14, 18, 24, 32, 40, 55, 70]

function TextNode({ id }: NodeProps<TextNodeData>) {
  const [text, setText] = useNodeDataState<TextNodeData, string>(id, 'text', '')
  const [fontSize, setFontSize] = useNodeDataState<TextNodeData, number>(
    id,
    'fontSize',
    18
  )
  const [editing, setEditing] = useState(false)
  const handleDoubleClick = useCallback(
    (e: any) => {
      setEditing(true)
      setTimeout(() => {
        e.target.focus()
        const range = document.createRange()
        range.selectNodeContents(e.target)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }, 0)
    },
    [setEditing]
  )
  const handleBlur = useCallback(
    (e: any) => {
      setEditing(false)
      setText(e.currentTarget.textContent)
    },
    [setEditing]
  )

  const handleIncreaseSize = useCallback(() => {
    let currentSizeIndex = fontSizes.indexOf(fontSize)
    if (currentSizeIndex === -1) currentSizeIndex = 3
    let newFontSizeIndex = currentSizeIndex + 1
    if (newFontSizeIndex >= fontSizes.length)
      newFontSizeIndex = fontSizes.length - 1
    if (newFontSizeIndex < 0) newFontSizeIndex = 0
    setFontSize(fontSizes[newFontSizeIndex])
  }, [fontSize])

  const handleDecreaseSize = useCallback(() => {
    let currentSizeIndex = fontSizes.indexOf(fontSize)
    if (currentSizeIndex === -1) currentSizeIndex = 3
    let newFontSizeIndex = currentSizeIndex - 1
    if (newFontSizeIndex >= fontSizes.length)
      newFontSizeIndex = fontSizes.length - 1
    if (newFontSizeIndex < 0) newFontSizeIndex = 0
    setFontSize(fontSizes[newFontSizeIndex])
  }, [fontSize])

  return (
    <div
      className="rounded"
      style={
        text
          ? {}
          : { border: 'dashed 1px rgba(255, 255, 255, 0.5)', margin: -1 }
      }
    >
      <NodeToolbar position={Position.Top}>
        <div className="bg-white rounded text-gray-500 flex">
          <button
            className="p-1 active:opacity-50"
            onClick={handleDecreaseSize}
          >
            <MinusCircleIcon className="w-6 h-6" />
          </button>
          <button
            className="p-1 active:opacity-50"
            onClick={handleIncreaseSize}
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </NodeToolbar>
      <div
        className="text-white py-2 px-3 bg-transparent"
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: text || '&nbsp;' }}
        style={{ fontSize, minWidth: 100 }}
        contentEditable={editing}
      />
    </div>
  )
}

export default TextNode
