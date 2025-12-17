export interface Product {
  id: string;
  name: string;
  image_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface BoardSpace {
  id: string;
  position: number;
  type: 'product' | 'penalty' | 'empty';
  product_id: string | null;
  created_at: string;
}

export interface GameSession {
  id: string;
  player_position: number;
  selected_product_id: string | null;
  is_completed: boolean;
  created_at: string;
}

export type YutResult = {
  name: '도' | '개' | '걸' | '윷' | '모' | '빽도';
  move: number;
  icon: string;
};
