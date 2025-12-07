import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

export default function ResultPage() {
  const navigate = useNavigate()
  const { clickCount, resetGame, bestClickCount, totalClicks, firstAdmitAt, challengeBest, recordAdmit } = useGameStore()
  const certRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    recordAdmit()
    let stop = false
    import('canvas-confetti').then(({ default: confetti }) => {
      if (stop) return
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ffb6c1', '#ff1493', '#fff0f5']
      })
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 250)
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 450)
    })
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    osc.stop(ctx.currentTime + 0.4)
    return () => { stop = true; ctx.close() }
  }, [])

  const drawCertificate = () => {
    const canvas = certRef.current
    if (!canvas) return
    const w = 720, h = 1020
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0,0,w,h)
    grad.addColorStop(0,'#fff0f5')
    grad.addColorStop(1,'#ffe4e1')
    ctx.fillStyle = grad
    ctx.fillRect(0,0,w,h)
    ctx.fillStyle = '#ff69b4'
    ctx.font = 'bold 48px Apple SD Gothic Neo, Arial'
    ctx.textAlign = 'center'
    ctx.fillText('猪猪认证证书', w/2, 120)
    ctx.font = 'bold 36px Apple SD Gothic Neo, Arial'
    ctx.fillText('你就是猪！🐷', w/2, 220)
    ctx.font = '28px Apple SD Gothic Neo, Arial'
    ctx.fillStyle = '#ff1493'
    ctx.fillText(`坚持次数：${clickCount}`, w/2, 320)
    ctx.fillStyle = '#c71585'
    ctx.fillText(`最佳坚持：${bestClickCount}，总点击：${totalClicks}`, w/2, 370)
    ctx.fillStyle = '#ff69b4'
    ctx.fillText(`挑战最佳：${challengeBest}`, w/2, 420)
    ctx.fillStyle = '#666'
    const date = new Date().toLocaleString()
    ctx.fillText(`日期：${date}`, w/2, 470)
    ctx.font = '24px Apple SD Gothic Neo, Arial'
    ctx.fillStyle = '#555'
    if (firstAdmitAt) ctx.fillText(`首次承认：${new Date(firstAdmitAt).toLocaleString()}`, w/2, 510)
    ctx.font = '20px Apple SD Gothic Neo, Arial'
    ctx.fillStyle = '#333'
    ctx.fillText('—— 分享可爱，拥抱真香 ——', w/2, 580)
    ctx.font = '96px serif'
    ctx.fillText('🐽', w/2, 720)
  }

  const saveCertificate = () => {
    drawCertificate()
    const canvas = certRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = '猪猪认证证书.png'
    a.click()
  }

  const copyShare = async () => {
    const text = `我承认了，我就是猪！坚持了${clickCount}次！来试试你能坚持多少：https://clt111.github.io/pig-test/`
    try {
      await navigator.clipboard.writeText(text)
      alert('分享文案已复制')
    } catch {
      alert(text)
    }
  }

  const handleReplay = () => {
    resetGame()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-300 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-6 sm:left-10 text-4xl sm:text-8xl animate-bounce" style={{ animationDelay: '0s' }}>🐷</div>
        <div className="absolute top-28 sm:top-32 right-8 sm:right-20 text-3xl sm:text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐽</div>
        <div className="absolute bottom-28 sm:bottom-32 left-20 sm:left-32 text-4xl sm:text-7xl animate-bounce" style={{ animationDelay: '1s' }}>💗</div>
        <div className="absolute bottom-8 sm:bottom-10 right-6 sm:right-10 text-3xl sm:text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🐷</div>
        <div className="absolute top-1/2 left-1/4 text-2xl sm:text-4xl animate-pulse">✨</div>
        <div className="absolute top-1/3 right-1/3 text-2xl sm:text-4xl animate-pulse" style={{ animationDelay: '0.8s' }}>✨</div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center space-y-12">
        {/* 结果标题 */}
        <div className="space-y-6">
          <div className="text-5xl sm:text-8xl animate-bounce mb-2 sm:mb-4">🐷</div>
          <h1 className="text-4xl sm:text-7xl font-bold text-gradient-pink mb-2 sm:mb-4 drop-shadow-xl animate-pulse">
            你就是猪！
          </h1>
          <div className="text-4xl sm:text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</div>
        </div>

        {/* 游戏统计 */}
        <div className="bg-white bg-opacity-80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="text-pink-600 text-base sm:text-xl font-medium space-y-2">
            <p>🎯 你坚持了 {clickCount} 次才承认</p>
            <p>😄 最终还是逃不过真相</p>
            <p>🐽 欢迎加入猪猪俱乐部！</p>
          </div>
        </div>

        {/* 重玩与分享、证书按钮 */}
        <button
          onClick={handleReplay}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-lg sm:text-xl pink-button flex items-center gap-3 group"
        >
          <span className="text-xl sm:text-2xl group-hover:animate-spin">🔄</span>
          再玩一次
        </button>

        <div className="flex items-center justify-center gap-4">
          <button onClick={copyShare} className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full text-base pink-button">复制分享文案</button>
          <button onClick={saveCertificate} className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full text-base pink-button">保存证书</button>
        </div>

        {/* 分享提示与证书画布（隐藏） */}
        <div className="text-pink-500 text-base sm:text-lg font-medium animate-pulse">
          <p>快分享给朋友，看看他们是不是也是猪！😄</p>
        </div>
        <canvas ref={certRef} className="hidden" />
      </div>
    </div>
  )
}
