import { Download, RotateCcw, RotateCw } from 'lucide-react'

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
      <button onClick={onUndoHandler}>
        <RotateCcw />
      </button>
      <button onClick={onRedoHandler}>
        <RotateCw />
      </button>
      <button onClick={onDownloadHandler}>
        <Download />
      </button>
      <button onClick={onZoomInHandler}>
        <span>+</span>
      </button>
      <button onClick={onZoomOutHandler}>
        <span>-</span>
      </button>
    </div>
  )
};
