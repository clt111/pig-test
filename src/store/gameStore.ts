import { create } from 'zustand'

interface GameState {
  yesButtonSize: number
  noButtonSize: number
  clickCount: number
  bestClickCount: number
  totalClicks: number
  firstAdmitAt: string | null
  resetGame: () => void
  incrementClickCount: () => void
  updateButtonSizes: (yesSize: number, noSize: number) => void
  recordAdmit: () => void
  loadFromStorage: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  yesButtonSize: 100,
  noButtonSize: 100,
  clickCount: 0,
  bestClickCount: Number(localStorage.getItem('bestClickCount') || 0),
  totalClicks: Number(localStorage.getItem('totalClicks') || 0),
  firstAdmitAt: localStorage.getItem('firstAdmitAt') || null,
  resetGame: () => set({ 
    yesButtonSize: 100, 
    noButtonSize: 100, 
    clickCount: 0 
  }),
  incrementClickCount: () => set((state) => {
    const newClick = state.clickCount + 1
    const newTotal = state.totalClicks + 1
    const best = Math.max(state.bestClickCount, newClick)
    localStorage.setItem('totalClicks', String(newTotal))
    localStorage.setItem('bestClickCount', String(best))
    return { 
      clickCount: newClick,
      totalClicks: newTotal,
      bestClickCount: best
    }
  }),
  updateButtonSizes: (yesSize: number, noSize: number) => set({ 
    yesButtonSize: yesSize, 
    noButtonSize: noSize 
  }),
  recordAdmit: () => set((state) => {
    if (!state.firstAdmitAt) {
      const now = new Date().toISOString()
      localStorage.setItem('firstAdmitAt', now)
      return { firstAdmitAt: now }
    }
    return {}
  }),
  loadFromStorage: () => set(() => ({
    bestClickCount: Number(localStorage.getItem('bestClickCount') || 0),
    totalClicks: Number(localStorage.getItem('totalClicks') || 0),
    firstAdmitAt: localStorage.getItem('firstAdmitAt') || null,
  }))
}))
