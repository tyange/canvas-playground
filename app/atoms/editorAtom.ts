import { atom } from 'jotai'

export interface MaskedArea {
  x: number
  y: number
  width: number
  height: number
  zoomLevel: number
  bgColor: string
}

export const INITIAL_MASKED_AREA = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zoomLevel: 1,
  bgColor: 'rgba(255,255,255,1)',
}

interface EditorAtom {
  originImageSource: string | undefined
  maskedAreas: MaskedArea[]
  beforeMaskedAreasHistory: MaskedArea[][]
  currentStep: number
  zoomLevel: number
}

const initialAtom: EditorAtom = {
  originImageSource: undefined,
  maskedAreas: [],
  beforeMaskedAreasHistory: [],
  currentStep: 0,
  zoomLevel: 1,
}

type EditorAction
  = | { type: 'undo' | 'redo' | 'historyUpdate' | 'zoomIn' | 'zoomOut' }
    | { type: 'setOriginImageSource', payload: string }
    | {
      type: 'masked'
      payload: MaskedArea
    }

export const editorAtom = atom(initialAtom)

export const editorActionsAtom = atom(
  null,
  (get, set, action: EditorAction) => {
    const current = get(editorAtom)

    switch (action.type) {
      case 'setOriginImageSource': {
        set(editorAtom, {
          ...current,
          originImageSource: action.payload,
        })
        break
      }
      case 'masked': {
        set(editorAtom, {
          ...current,
          maskedAreas: [...current.maskedAreas, action.payload],
          currentStep: current.currentStep + 1,
          beforeMaskedAreasHistory: [],
        })
        break
      }
      case 'undo': {
        const newMaskedAreas = [...current.maskedAreas]
        newMaskedAreas.pop()

        set(editorAtom, {
          ...current,
          maskedAreas: newMaskedAreas,
          currentStep: current.currentStep - 1,
          beforeMaskedAreasHistory: [
            ...current.beforeMaskedAreasHistory,
            [...current.maskedAreas],
          ],
        })
        break
      }
      case 'redo': {
        const newBeforeMaskedAreasHistory = [...current.beforeMaskedAreasHistory]
        const lastHistory = newBeforeMaskedAreasHistory.pop()

        set(editorAtom, {
          ...current,
          currentStep: current.currentStep + 1,
          maskedAreas: lastHistory || [],
          beforeMaskedAreasHistory: newBeforeMaskedAreasHistory,
        })
        break
      }
      case 'zoomIn': {
        const zoomInLevel = current.zoomLevel + 0.1
        set(editorAtom, {
          ...current,
          zoomLevel: zoomInLevel > 0.1 ? zoomInLevel : 0.1,
        })
        break
      }
      case 'zoomOut': {
        const zoomOutLevel = current.zoomLevel - 0.1
        set(editorAtom, {
          ...current,
          zoomLevel: zoomOutLevel > 0.1 ? zoomOutLevel : 0.1,
        })
        break
      }
    }
  },
)
