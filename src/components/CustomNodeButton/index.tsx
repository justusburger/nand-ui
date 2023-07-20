import { useCallback, useRef, useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { CustomNodeType } from '../../nodeTypes'
import { Menu, MenuItem } from '@mui/material'
import { useDrag } from 'react-dnd'

interface CustomNodeButtonProps {
  nodeType: CustomNodeType
  onDelete: (nodeType: CustomNodeType) => void
}

function CustomNodeButton({ nodeType, onDelete }: CustomNodeButtonProps) {
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])
  const handleDelete = useCallback(() => {
    onDelete(nodeType)
    setOpen(false)
  }, [nodeType, onDelete])
  const handleUnpack = useCallback(() => {
    setOpen(false)
  }, [nodeType, onDelete])
  const containerRef = useRef(null)
  const [, dragRef] = useDrag(
    () => ({
      type: 'node',
      item: nodeType,
    }),
    []
  )
  return (
    <div
      className="flex bg-white rounded mr-1 mb-1 shadow-md shadow-gray-500"
      ref={containerRef}
    >
      <button
        ref={dragRef}
        key={nodeType.id}
        className="rounded px-2 py-1 text-sm cursor-pointer"
      >
        {nodeType.name}
      </button>
      <div
        className="flex items-center px-2 border-l-slate-300 border-solid cursor-pointer"
        style={{ borderLeftWidth: 1 }}
        onClick={handleOpen}
      >
        <ChevronUpIcon className="w-3 h-3 text-gray-500" />
      </div>
      <Menu
        anchorEl={containerRef.current}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleUnpack}>
          <div className="text-sm">Unpack</div>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <div className="text-sm">Delete</div>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default CustomNodeButton
