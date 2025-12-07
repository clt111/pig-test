import { create } from 'zustand'

interface GameState {
  yesButtonSize: number
  noButtonSize: number
  clickCount: number
  bestClickCount: number
  totalClicks: number
  firstAdmitAt: string | null
  challengeMode: boolean
  challengeStartAt: number | null
  challengeScore: number
  challengeBest: number
  dailyDate: string | null
  dailyDone: boolean
  resetGame: () => void
  incrementClickCount: () => void
  updateButtonSizes: (yesSize: number, noSize: number) => void
  startChallenge: () => void
  endChallenge: () => void
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
  challengeMode: false,
  challengeStartAt: null,
  challengeScore: 0,
  challengeBest: Number(localStorage.getItem('challengeBest') || 0),
  dailyDate: localStorage.getItem('dailyDate'),
  dailyDone: localStorage.getItem('dailyDone') === 'true',
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
      bestClickCount: best,
      challengeScore: state.challengeMode ? state.challengeScore + 1 : state.challengeScore
    }
  }),
  updateButtonSizes: (yesSize: number, noSize: number) => set({ 
    yesButtonSize: yesSize, 
    noButtonSize: noSize 
  }),
  startChallenge: () => set(() => {
    const today = new Date().toISOString().slice(0,10)
    localStorage.setItem('dailyDate', today)
    localStorage.setItem('dailyDone', 'false')
    return {
      challengeMode: true,
      challengeStartAt: Date.now(),
      challengeScore: 0,
      dailyDate: today,
      dailyDone: false,
    }
  }),
  endChallenge: () => set((state) => {
    const best = Math.max(state.challengeBest, state.challengeScore)
    localStorage.setItem('challengeBest', String(best))
    localStorage.setItem('dailyDone', 'true')
    return {
      challengeMode: false,
      challengeStartAt: null,
      challengeBest: best,
      dailyDone: true,
    }
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
    challengeBest: Number(localStorage.getItem('challengeBest') || 0),
    dailyDate: localStorage.getItem('dailyDate'),
    dailyDone: localStorage.getItem('dailyDone') === 'true',
  }))
}))
