import { Download, Minus, Plus, RotateCcw, RotateCw } from 'lucide-react'

interface EditorPanelProps {
  onUndoHandler: () => void
  onRedoHandler: () => void
  onDownloadHandler: () => void
  onZoomInHandler: () => void
  onZoomOutHandler: () => void
}

export default function EditorPanel({
  onUndoHandler,
  onRedoHandler,
  onDownloadHandler,
  onZoomInHandler,
  onZoomOutHandler,
}: EditorPanelProps) {
  return (
    <div className="w-full flex justify-center gap-5 py-5">
      <button className="border border-gray-200 rounded cursor-pointer p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all" onClick={onUndoHandler}>
        <RotateCcw className="text-gray-600" />
      </button>
      <button className="border border-gray-200 rounded cursor-pointer p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all" onClick={onRedoHandler}>
        <RotateCw className="text-gray-600" />
      </button>
      <button className="border border-gray-200 rounded cursor-pointer p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all" onClick={onDownloadHandler}>
        <Download className="text-gray-600" />
      </button>
      <button className="border border-gray-200 rounded cursor-pointer p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all" onClick={onZoomInHandler}>
        <Plus className="text-gray-600" />
      </button>
      <button className="border border-gray-200 rounded cursor-pointer p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all" onClick={onZoomOutHandler}>
        <Minus className="text-gray-600" />
      </button>
    </div>
  )
};
