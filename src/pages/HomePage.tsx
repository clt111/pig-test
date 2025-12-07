import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useEffect, useRef, useState } from 'react'
import { useViewport } from '@/hooks/useViewport'

export default function HomePage() {
  const navigate = useNavigate()
  const { 
    yesButtonSize, noButtonSize, clickCount, incrementClickCount, updateButtonSizes,
    loadFromStorage
  } = useGameStore()
  const [isAnimating, setIsAnimating] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null)
  const { vw, vh } = useViewport()
  const [phrases, setPhrases] = useState<{ id: number; text: string }[]>([])
  const [combo, setCombo] = useState<number>(0)
  const [spawnPigs, setSpawnPigs] = useState<number[]>([])
  const noBtnRef = useRef<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  

  const addPhrase = (text: string) => {
    const id = Date.now() + Math.random()
    setPhrases((list) => [...list, { id, text }])
    setTimeout(() => {
      setPhrases((list) => list.filter((p) => p.id !== id))
    }, 1200)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!noBtnRef.current) return
    const rect = noBtnRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const px = e.clientX
    const py = e.clientY
    const dx = cx - px
    const dy = cy - py
    const dist = Math.sqrt(dx*dx + dy*dy)
    const threshold = Math.max(80, rect.width)
    if (dist < threshold) {
      const step = Math.min(120, Math.max(30, threshold - dist))
      const angle = Math.atan2(dy, dx)
      const nx = (noButtonPos?.x ?? rect.left) + Math.cos(angle) * step
      const ny = (noButtonPos?.y ?? rect.top) + Math.sin(angle) * step
      const padding = 8
      const vwNow = window.visualViewport?.width ?? window.innerWidth
      const vhNow = window.visualViewport?.height ?? window.innerHeight
      const clampedX = Math.max(padding, Math.min(vwNow - rect.width - padding, nx))
      const clampedY = Math.max(padding, Math.min(vhNow - rect.height - padding, ny))
      setNoButtonPos({ x: clampedX, y: clampedY })
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  })

  const handleNoClick = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const nextCount = clickCount + 1
    incrementClickCount()
    if (navigator.vibrate) {
      try { navigator.vibrate(10) } catch {}
    }
    addPhrase(["不可能！","我很理性！","科学不允许我承认","我是清醒猪","哼！才不是呢"][Math.floor(Math.random()*5)])
    if (nextCount === 3) addPhrase('三次拒绝！嘴硬加一⭐️')
    if (nextCount === 5) addPhrase('五连拒！倔强小猪上线~')
    if (nextCount === 10) addPhrase('十连拒！真香倒计时开始…')
    setCombo((c) => {
      const now = Date.now()
      const newCombo = c + 1
      if (newCombo >= 5) {
        setSpawnPigs((arr) => [...arr, now])
        if (containerRef.current) {
          containerRef.current.classList.add('shake')
          setTimeout(() => containerRef.current && containerRef.current.classList.remove('shake'), 300)
        }
        return 0
      }
      setTimeout(() => setCombo((x) => (x > 0 ? x - 1 : 0)), 400)
      return newCombo
    })
    
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 dark:from-[#1f1720] dark:to-[#2b1f27] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
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
          <button ref={noBtnRef}
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

        {/* 嘴硬语录弹出 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
          {phrases.map((p) => (
            <div key={p.id} className="bg-white/90 dark:bg-black/40 backdrop-blur-md text-pink-700 px-4 py-2 rounded-full shadow animate-bounce-gentle">
              {p.text}
            </div>
          ))}
        </div>

        {/* 连击猪跑动画 */}
        <div className="pointer-events-none fixed inset-0">
          {spawnPigs.map((id) => (
            <div key={id} className="pig-run absolute bottom-8 left-0 text-4xl">🐷</div>
          ))}
        </div>
      </div>
    </div>
  )
}
