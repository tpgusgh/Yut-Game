import { useState } from 'react';
import { YutResult } from '../types/game';
import { Dice6 } from 'lucide-react';

interface YutThrowProps {
  onThrow: (result: YutResult) => void;
  disabled: boolean;
}

const yutResults: YutResult[] = [
  { name: '도', move: 1, icon: '●○○○' },
  { name: '도', move: 1, icon: '●○○○' },
  { name: '도', move: 1, icon: '●○○○' },
  { name: '도', move: 1, icon: '●○○○' },
  { name: '개', move: 2, icon: '●●○○' },
  { name: '개', move: 2, icon: '●●○○' },
  { name: '개', move: 2, icon: '●●○○' },
  { name: '걸', move: 3, icon: '●●●○' },
  { name: '걸', move: 3, icon: '●●●○' },
  { name: '걸', move: 3, icon: '●●●○' },
  { name: '윷', move: 4, icon: '●●●●' },
  { name: '모', move: 5, icon: '○○○○' },
  { name: '빽도', move: -1, icon: '○●○○' },
];

export default function YutThrow({ onThrow, disabled }: YutThrowProps) {
  const [isThowing, setIsThowing] = useState(false);
  const [lastResult, setLastResult] = useState<YutResult | null>(null);

  const throwYut = () => {
    if (disabled || isThowing) return;

    setIsThowing(true);
    setLastResult(null);

    setTimeout(() => {
      const result = yutResults[Math.floor(Math.random() * yutResults.length)];
      setLastResult(result);
      setIsThowing(false);
      onThrow(result);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">윷 던지기</h3>
        <button
          onClick={throwYut}
          disabled={disabled || isThowing}
          className={`relative px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            isThowing ? 'animate-pulse' : ''
          }`}
        >
          <Dice6 className={`w-6 h-6 mx-auto ${isThowing ? 'animate-spin' : ''}`} />
          <div className="mt-2 text-sm">{isThowing ? '던지는 중...' : '윷 던지기'}</div>
        </button>
      </div>

      {lastResult && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center animate-bounce">
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {lastResult.name}
          </div>
          <div className="text-2xl mb-2">{lastResult.icon}</div>
          <div className="text-gray-600">
            {lastResult.move > 0 ? `${lastResult.move}칸 이동` : '1칸 뒤로'}
          </div>
        </div>
      )}
    </div>
  );
}
