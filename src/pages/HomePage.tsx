import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useState } from 'react'
import { useViewport } from '@/hooks/useViewport'

export default function HomePage() {
  const navigate = useNavigate()
  const { yesButtonSize, noButtonSize, clickCount, incrementClickCount, updateButtonSizes } = useGameStore()
  const [isAnimating, setIsAnimating] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null)
  const { vw, vh } = useViewport()

  const maxYes = Math.min(vw, vh) * 0.6
  const maxNo = Math.min(vw, vh) * 0.5
  const currentYes = Math.min(yesButtonSize, Math.max(96, maxYes))
  const currentNo = Math.min(noButtonSize, Math.max(72, maxNo))

  const getRandomNoButtonPosition = (size: number) => {
    const padding = 16
    const vwNow = window.visualViewport?.width ?? window.innerWidth
    const vhNow = window.visualViewport?.height ?? window.innerHeight
    const maxX = Math.max(padding, vwNow - size - padding)
    const maxY = Math.max(padding, vhNow - size - padding)
    const x = Math.floor(Math.random() * maxX)
    const y = Math.floor(Math.random() * maxY)
    return { x, y }
  }

  const handleNoClick = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    incrementClickCount()
    
    // "不是"按钮变小，"是"按钮变大
    const newNoSize = Math.max(56, noButtonSize - 15)
    const newYesSize = Math.min(180, yesButtonSize + 20)
    
    updateButtonSizes(newYesSize, newNoSize)
    setNoButtonPos(getRandomNoButtonPosition(newNoSize))
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleYesClick = () => {
    navigate('/result')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🐷</div>
        <div className="absolute top-40 right-32 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🐽</div>
        <div className="absolute bottom-40 left-40 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>💗</div>
        <div className="absolute bottom-20 right-20 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐷</div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center space-y-12">
        {/* 问题显示区 */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient-pink mb-2 sm:mb-4 drop-shadow-lg">
            你是不是猪？
          </h1>
          <div className="text-3xl sm:text-4xl animate-pulse">🐷</div>
        </div>

        {/* 按钮区域 */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center justify-center">
          {/* 是按钮 */}
          <button
            onClick={handleYesClick}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-full pink-button flex items-center justify-center min-w-[56px] min-h-[56px]"
            style={{
              width: `${currentYes}px`,
              height: `${currentYes}px`,
              fontSize: `${Math.max(14, Math.min(24, currentYes / 6))}px`
            }}
          >
            <span className="animate-pulse">是</span>
          </button>

        {/* 不是按钮 */}
          <button
            onClick={handleNoClick}
            disabled={isAnimating}
            className={`${noButtonPos ? 'fixed z-50' : ''} bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-full pink-button disabled:opacity-50 flex items-center justify-center min-w-[56px] min-h-[56px]`}
            style={{
              width: `${currentNo}px`,
              height: `${currentNo}px`,
              fontSize: `${Math.max(12, Math.min(20, currentNo / 7))}px`,
              left: noButtonPos ? `${noButtonPos.x}px` : undefined,
              top: noButtonPos ? `${noButtonPos.y}px` : undefined,
              transition: 'left 0.25s ease, top 0.25s ease'
            }}
          >
            <span className={isAnimating ? 'animate-bounce' : ''}>不是</span>
          </button>
        </div>

        {/* 点击计数显示 */}
        {clickCount > 0 && (
          <div className="text-pink-500 text-lg font-medium">
            你已经坚持了 {clickCount} 次！
          </div>
        )}
      </div>
    </div>
  )
}
