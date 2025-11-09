'use client'

import type { MaskedArea } from '@/app/atoms/editorAtom'
import { useAtom, useSetAtom } from 'jotai'
import { useRef, useState } from 'react'
import { editorActionsAtom, editorAtom, INITIAL_MASKED_AREA } from '@/app/atoms/editorAtom'

export default function Editor() {
  const [editorState] = useAtom(editorAtom)
  const dispatch = useSetAtom(editorActionsAtom)

  const [isDragging, setIsDragging] = useState(false)
  const [maskedArea, setMaskedArea] = useState<MaskedArea>(INITIAL_MASKED_AREA)
  const [fileName, setFileName] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return (
    <canvas ref={canvasRef}>

    </canvas>
  )
}
