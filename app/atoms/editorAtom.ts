import { atom } from 'jotai'

export interface MaskedArea {
  x: number
  y: number
  width: number
  height: number
  zoomLevel: number
}

export const INITIAL_MASKED_AREA = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  zoomLevel: 1,
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
    switch (action.type) {
      case 'setOriginImageSource':
        return {
          ...get(editorAtom),
          originImageSource: action.payload,
        }
      case 'masked':
        return {
          ...get(editorAtom),
          maskedAreas: [...get(editorAtom).maskedAreas, action.payload],
          currentStep: get(editorAtom).currentStep + 1,
          beforeMaskedAreasHistory: [],
        }
      case 'undo': {
        const newMaskedAreas = [...get(editorAtom).maskedAreas]
        newMaskedAreas.pop()

        return {
          ...get(editorAtom),
          maskedAreas: [...newMaskedAreas],
          currentStep: get(editorAtom).currentStep - 1,
          beforeMaskedAreasHistory: [
            ...get(editorAtom).beforeMaskedAreasHistory,
            [...get(editorAtom).maskedAreas],
          ],
        }
      }
      case 'redo': {
        const newBeforeMaskedAreasHistory = [...get(editorAtom).beforeMaskedAreasHistory]
        newBeforeMaskedAreasHistory.pop()

        return {
          ...get(editorAtom),
          currentStep: get(editorAtom).currentStep + 1,
          maskedAreas: [
            ...get(editorAtom).beforeMaskedAreasHistory[
              get(editorAtom).beforeMaskedAreasHistory.length - 1
            ],
          ],
          beforeMaskedAreasHistory: [...newBeforeMaskedAreasHistory],
        }
      }
      case 'zoomIn': {
        const zoomInLevel = get(editorAtom).zoomLevel + 0.1

        return {
          ...get(editorAtom),
          zoomLevel: zoomInLevel > 0.1 ? zoomInLevel : 0.1,
        }
      }
      case 'zoomOut': {
        const zoomOutLevel = get(editorAtom).zoomLevel - 0.1

        return {
          ...get(editorAtom),
          zoomLevel: zoomOutLevel > 0.1 ? zoomOutLevel : 0.1,
        }
      }
      default:
        return get(editorAtom)
    }
  },
)
