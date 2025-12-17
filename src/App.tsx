import { useState } from 'react';
import YutGame from './components/YutGame';
import AdminPanel from './components/AdminPanel';
import { Settings, GamepadIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'admin'>('game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === 'game'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GamepadIcon className="w-5 h-5" />
              게임
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              상품 관리
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {activeTab === 'game' ? <YutGame /> : <AdminPanel />}
      </div>
    </div>
  );
}

export default App;
