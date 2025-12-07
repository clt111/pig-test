import { create } from 'zustand'

interface GameState {
  yesButtonSize: number
  noButtonSize: number
  clickCount: number
  resetGame: () => void
  incrementClickCount: () => void
  updateButtonSizes: (yesSize: number, noSize: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  yesButtonSize: 100,
  noButtonSize: 100,
  clickCount: 0,
  resetGame: () => set({ 
    yesButtonSize: 100, 
    noButtonSize: 100, 
    clickCount: 0 
  }),
  incrementClickCount: () => set((state) => ({ 
    clickCount: state.clickCount + 1 
  })),
  updateButtonSizes: (yesSize: number, noSize: number) => set({ 
    yesButtonSize: yesSize, 
    noButtonSize: noSize 
  })
}))