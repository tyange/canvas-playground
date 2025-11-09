'use client'

import type { ChangeEventHandler, MouseEvent, MouseEventHandler } from 'react'
import type { MaskedArea } from '@/app/atoms/editorAtom'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { editorActionsAtom, editorAtom, INITIAL_MASKED_AREA } from '@/app/atoms/editorAtom'
import EditorPanel from '@/app/components/editor-panel'

export default function Editor() {
  const [editorState] = useAtom(editorAtom)
  const dispatch = useSetAtom(editorActionsAtom)

  const [isDragging, setIsDragging] = useState(false)
  const [maskedArea, setMaskedArea] = useState<MaskedArea>(INITIAL_MASKED_AREA)
  const [fileName, setFileName] = useState('')
  const [pickedColor, setPickedColor] = useState(INITIAL_MASKED_AREA.bgColor)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFileName(e.target.files[0].name)
      dispatch({
        type: 'setOriginImageSource',
        payload: URL.createObjectURL(e.target.files[0]),
      })
    }
  }

  const getCanvasCoordinates = (event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas)
      return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    const scaleFactor = 1 / editorState.zoomLevel

    const canvasX = event.clientX - rect.left
    const canvasY = event.clientY - rect.top

    const adjustedX = canvasX * scaleFactor
    const adjustedY = canvasY * scaleFactor

    return {
      x: adjustedX,
      y: adjustedY,
    }
  }

  const mouseDownHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
    const canvas = canvasRef.current
    if (!canvas)
      return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx)
      return

    const { x, y } = getCanvasCoordinates(e)

    const canvasX = Math.floor(x * editorState.zoomLevel)
    const canvasY = Math.floor(y * editorState.zoomLevel)

    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1)
    const [r, g, b, a] = imageData.data

    const pickedColorString = `rgba(${r},${g},${b},${a / 255})`
    setPickedColor(pickedColorString)

    setIsDragging(true)
    setMaskedArea({
      ...INITIAL_MASKED_AREA,
      x,
      y,
      bgColor: pickedColorString,
    })
  }

  const mouseMoveHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDragging)
      return

    const { x, y } = getCanvasCoordinates(e)
    const width = x - maskedArea.x
    const height = y - maskedArea.y

    setMaskedArea(prevState => ({
      ...prevState,
      width,
      height,
    }))
  }

  const mouseUpHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault()

    if (maskedArea.width !== 0 && maskedArea.height !== 0) {
      dispatch({
        type: 'masked',
        payload: { ...maskedArea, zoomLevel: editorState.zoomLevel },
      })
    }

    setIsDragging(false)

    setMaskedArea(() => INITIAL_MASKED_AREA)
  }

  const drawMaskedAreas = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) {
      return
    }

    editorState.maskedAreas.forEach((area) => {
      ctx!.fillStyle = area.bgColor
      ctx!.fillRect(area.x, area.y, area.width, area.height)
    })
  }

  const drawDragArea = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) {
      return
    }

    ctx.fillStyle = pickedColor

    ctx.fillRect(
      maskedArea.x,
      maskedArea.y,
      maskedArea.width,
      maskedArea.height,
    )

    drawMaskedAreas(ctx)
  }

  const drawImageWithMaskedAreas = () => {
    const canvas = canvasRef.current

    if (!canvas || !editorState.originImageSource) {
      return
    }

    const originImageLayerContext = canvas.getContext('2d', {
      willReadFrequently: true,
    })

    const image = new Image()
    image.src = editorState.originImageSource

    image.onload = () => {
      canvas.width = Math.round(image.width * editorState.zoomLevel)
      canvas.height = Math.round(image.height * editorState.zoomLevel)

      originImageLayerContext!.save()
      originImageLayerContext!.scale(editorState.zoomLevel, editorState.zoomLevel)
      originImageLayerContext!.drawImage(image, 0, 0)
      drawDragArea(originImageLayerContext)
    }

    originImageLayerContext!.restore()
  }

  useEffect(drawImageWithMaskedAreas, [
    editorState,
    maskedArea,
  ])

  const onUndoHandler = () => {
    if (editorState.currentStep <= 0)
      return

    dispatch({ type: 'undo' })
  }

  const onRedoHandler = () => {
    if (editorState.beforeMaskedAreasHistory.length === 0)
      return

    dispatch({ type: 'redo' })
  }

  const onZoomInHandler = () => {
    dispatch({ type: 'zoomIn' })
  }

  const onZoomOutHandler = () => {
    dispatch({ type: 'zoomOut' })
  }

  const onDownloadHandler = () => {
    const originCanvas = canvasRef.current

    if (!originCanvas) {
      return
    }

    const dataURL = originCanvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${fileName}_edited.png`

    link.click()
  }

  return (
    <div className="border rounded-md flex flex-col w-fit h-fit border-gray-300 shadow-md">
      <EditorPanel
        onUndoHandler={onUndoHandler}
        onRedoHandler={onRedoHandler}
        onDownloadHandler={onDownloadHandler}
        onZoomInHandler={onZoomInHandler}
        onZoomOutHandler={onZoomOutHandler}
      />
      <div className="w-full flex justify-center">
        <input
          id="fileInput"
          type="file"
          className="p-3 hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={fileChangeHandler}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          Select File
        </label>
      </div>
      <div
        className="w-full h-full p-3 border-t border-gray-300 mt-3 overflow-auto"
        style={{ width: '700px', height: '500px' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={mouseDownHandler}
          onMouseMove={mouseMoveHandler}
          onMouseUp={mouseUpHandler}
        />
      </div>
    </div>
  )
}
