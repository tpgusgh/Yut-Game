import { BoardSpace as BoardSpaceType, Product } from '../types/game';

interface BoardSpaceProps {
  space: BoardSpaceType;
  product: Product | null;
  productIndex: number | null;
  isCurrentPosition: boolean;
  onSelect?: () => void;
  canSelect: boolean;
}

export default function BoardSpace({
  space,
  product,
  productIndex,
  isCurrentPosition,
  onSelect,
  canSelect,
}: BoardSpaceProps) {
  const isProductSpace = space.type === 'product';
  const isPenaltySpace = space.type === 'penalty';

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
        isCurrentPosition
          ? 'border-blue-500 bg-blue-100 shadow-md'
          : isProductSpace
          ? 'border-green-400 bg-green-50'
          : isPenaltySpace
          ? 'border-red-400 bg-red-50'
          : 'border-gray-300 bg-gray-50'
      } ${canSelect && isCurrentPosition ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <div className="text-sm font-bold text-gray-600">
        {space.position + 1}
      </div>

      {productIndex !== null && (
        <div className="text-[10px] font-semibold text-green-600 mt-1">
        {productIndex + 1}
        </div>
      )}

      {isCurrentPosition && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
          👤
        </div>
      )}

      {canSelect && isCurrentPosition && isProductSpace && (
        <button
          onClick={onSelect}
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold rounded shadow"
        >
          선택
        </button>
      )}
    </div>
  );
}
