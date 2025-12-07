import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

export default function ResultPage() {
  const navigate = useNavigate()
  const { clickCount, resetGame } = useGameStore()

  const handleReplay = () => {
    resetGame()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-300 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl animate-bounce" style={{ animationDelay: '0s' }}>🐷</div>
        <div className="absolute top-32 right-20 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐽</div>
        <div className="absolute bottom-32 left-32 text-7xl animate-bounce" style={{ animationDelay: '1s' }}>💗</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🐷</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-pulse">✨</div>
        <div className="absolute top-1/3 right-1/3 text-4xl animate-pulse" style={{ animationDelay: '0.8s' }}>✨</div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center space-y-12">
        {/* 结果标题 */}
        <div className="space-y-6">
          <div className="text-8xl animate-bounce mb-4">🐷</div>
          <h1 className="text-7xl font-bold text-gradient-pink mb-4 drop-shadow-xl animate-pulse">
            你就是猪！
          </h1>
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</div>
        </div>

        {/* 游戏统计 */}
        <div className="bg-white bg-opacity-80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="text-pink-600 text-xl font-medium space-y-2">
            <p>🎯 你坚持了 {clickCount} 次才承认</p>
            <p>😄 最终还是逃不过真相</p>
            <p>🐽 欢迎加入猪猪俱乐部！</p>
          </div>
        </div>

        {/* 重玩按钮 */}
        <button
          onClick={handleReplay}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl pink-button flex items-center gap-3 group"
        >
          <span className="text-2xl group-hover:animate-spin">🔄</span>
          再玩一次
        </button>

        {/* 分享提示 */}
        <div className="text-pink-500 text-lg font-medium animate-pulse">
          <p>快分享给朋友，看看他们是不是也是猪！😄</p>
        </div>
      </div>
    </div>
  )
}