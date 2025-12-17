import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BoardSpace as BoardSpaceType, Product, YutResult } from '../types/game';
import BoardSpace from './BoardSpace';
import YutThrow from './YutThrow';
import { Trophy } from 'lucide-react';

export default function YutGame() {
  const [boardSpaces, setBoardSpaces] = useState<BoardSpaceType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [canSelect, setCanSelect] = useState(false);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    const { data: spaces } = await supabase
      .from('board_spaces')
      .select('*')
      .order('position');

    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (spaces) {
      // 처음 5칸 (position 0-4)을 'empty'로 설정
      const updatedSpaces = spaces.map(space => 
        space.position <= 4 ? { ...space, type: 'empty' as const } : space
      );
      setBoardSpaces(updatedSpaces);
    }
    if (prods) setProducts(prods);
  };

  const handleYutThrow = (result: YutResult) => {
    setCanSelect(false);

    setTimeout(() => {
      let newPosition = playerPosition + result.move;

      if (newPosition < 0) newPosition = 0;
      if (newPosition >= boardSpaces.length) newPosition = boardSpaces.length - 1;

      setPlayerPosition(newPosition);

      const currentSpace = boardSpaces[newPosition];
      if (currentSpace && currentSpace.type === 'penalty') {
        // 꽝 칸에 도착하면 바로 처음으로 돌아감
        setPlayerPosition(0);
      } else if (currentSpace && currentSpace.type === 'product') {
        setCanSelect(true);
      }
    }, 500);
  };

  const handleSelectProduct = () => {
    const currentSpace = boardSpaces[playerPosition];
    if (currentSpace && currentSpace.type === 'product') {
      const product = products.find(p =>
        boardSpaces.filter(s => s.type === 'product').indexOf(currentSpace) < products.length
      );

      if (product) {
        setSelectedProduct(product);
        setGameCompleted(true);
        setCanSelect(false);
      }
    }
  };

  const resetGame = () => {
    setPlayerPosition(0);
    setSelectedProduct(null);
    setGameCompleted(false);
    setCanSelect(false);
  };

  const getProductForSpace = (space: BoardSpaceType): { product: Product | null; index: number | null } => {
    if (space.type !== 'product') return { product: null, index: null };
    const productSpaces = boardSpaces.filter(s => s.type === 'product');
    const index = productSpaces.findIndex(s => s.position === space.position);
    const productIndex = Math.floor(index / 4);
    return { product: products[productIndex] || null, index: productIndex };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600 mb-2">윷놀이 상품 게임</h1>
          <p className="text-gray-600 text-lg">윷을 던져 꽝 칸을 피하고 원하는 상품을 선택하세요!</p>
        </div>

        {gameCompleted && selectedProduct ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-2xl mx-auto">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">축하합니다!</h2>
            <div className="mb-6">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-48 h-48 object-cover rounded-xl mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
              <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              다시 하기
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 상품 목록 표시 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">상품 목록</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-green-600 mb-2">상품 {index + 1}</div>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <div className="text-sm font-semibold text-gray-800">{product.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{product.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">게임 보드</h2>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                  {boardSpaces.map((space) => {
                    const { product, index: productIndex } = getProductForSpace(space);
                    return (
                      <BoardSpace
                        key={space.id}
                        space={space}
                        product={product}
                        productIndex={productIndex}
                        isCurrentPosition={space.position === playerPosition}
                        onSelect={handleSelectProduct}
                        canSelect={canSelect && space.position === playerPosition}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center">
                <YutThrow onThrow={handleYutThrow} disabled={gameCompleted} />
                <div className="mt-4">
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all text-sm"
                  >
                    게임 초기화
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
