import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/game';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    description: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (data) setProducts(data);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.image_url) return;

    const { error } = await supabase.from('products').insert([
      {
        name: formData.name,
        image_url: formData.image_url,
        description: formData.description,
        is_active: true,
      },
    ]);

    if (!error) {
      setFormData({ name: '', image_url: '', description: '' });
      setIsAdding(false);
      loadProducts();
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name || !formData.image_url) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        image_url: formData.image_url,
        description: formData.description,
      })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      setFormData({ name: '', image_url: '', description: '' });
      loadProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (!error) {
      loadProducts();
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      image_url: product.image_url,
      description: product.description,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', image_url: '', description: '' });
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', image_url: '', description: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">상품 관리</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition-all"
        >
          <Plus className="w-5 h-5" />
          상품 추가
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">새 상품 추가</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                상품 이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="상품 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pexels, Unsplash 등의 이미지 URL을 입력하세요
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="상품 설명을 입력하세요"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-all"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
          >
            {editingId === product.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    상품 이름
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이미지 URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(product.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
