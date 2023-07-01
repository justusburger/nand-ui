import {
  MinusCircleIcon,
  PlusCircleIcon,
  StopCircleIcon,
} from '@heroicons/react/24/outline'
import { NodeHandleData } from '../NodeHandle'

interface EditHandlesPanelProps {
  handles: NodeHandleData[]
  handleRemoveHandle: () => void
  handleAddHandle: () => void
  handleBinaryChange: (handleId: string) => void
  handleLabelChange: (e: any, handleId: string) => void
}
function EditHandlesPanel({
  handles,
  handleRemoveHandle,
  handleAddHandle,
  handleBinaryChange,
  handleLabelChange,
}: EditHandlesPanelProps) {
  return (
    <div className="bg-white rounded text-black p-3">
      <div className="mb-2 text-lg flex">
        <div className="mr-auto font-bold">Handles</div>
        <div className="flex justify-center items-center">
          <button
            className="disabled:opacity-20 text-gray-300  hover:text-gray-500"
            onClick={handleRemoveHandle}
            disabled={handles.length < 2}
          >
            <MinusCircleIcon className="w-6 h-6" />
          </button>
          <div className="px-1 text-sm">{handles.length}bit</div>
          <button
            onClick={handleAddHandle}
            className="text-gray-300 hover:text-gray-500"
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr className="text-xs text-left font-normal">
            <th className="font-normal text-left"></th>
            <th className="font-normal text-right">Label</th>
          </tr>
        </thead>
        <tbody>
          {handles.map((handleData) => (
            <tr key={handleData.id}>
              <td className="">
                <div
                  className={
                    'cursor-pointer pr-1 hover:text-gray-500 ' +
                    (handleData.isBinary ? 'text-gray-300' : 'text-gray-700')
                  }
                  onClick={() => handleBinaryChange(handleData.id)}
                >
                  <StopCircleIcon className="w-6 h-6 " />
                </div>
              </td>
              <td>
                <input
                  type="text"
                  className="bg-gray-100 rounded py-1 px-2 text-sm"
                  value={handleData.label}
                  onChange={(e) => handleLabelChange(e, handleData.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EditHandlesPanel
