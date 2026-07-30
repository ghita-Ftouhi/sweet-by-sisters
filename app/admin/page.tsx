'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  payment_method: string;
  locale: string;
  items: { name: string; emoji: string; price: number; quantity: number; type: string; contents?: { name: string; emoji: string; quantity: number }[] }[];
};

type Product = {
  id: string;
  emoji: string;
  name_fr: string;
  price: number;
  in_stock: boolean;
  badge: string | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: '⏳ En attente',  color: 'bg-yellow-100 text-yellow-700' },
  preparing: { label: '👩‍🍳 En préparation', color: 'bg-blue-100 text-blue-700' },
  ready:     { label: '✅ Prête',        color: 'bg-green-100 text-green-700' },
  delivered: { label: '🚚 Livrée',       color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: '❌ Annulée',      color: 'bg-red-100 text-red-600' },
};
const STATUS_ORDER = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function AdminPage() {
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('sort_order');
    setProducts(data ?? []);
  };

  const changeStatus = async (id: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          price: editingProduct.price,
          in_stock: editingProduct.in_stock,
          badge: editingProduct.badge,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || `Erreur ${res.status}`);
        return;
      }
      setEditingProduct(null);
      loadProducts();
    } catch {
      setSaveError('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  };

  const pending = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <div>
            <h1 className="font-display font-bold text-plum text-lg">Sweet by Sister</h1>
            <p className="text-xs text-gray-400">Tableau de bord admin</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/fr" className="text-xs text-gray-400 hover:text-rose-main transition-colors">← Retour au site</a>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-rose-main transition-colors">Déconnexion</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('orders')}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${tab === 'orders' ? 'bg-rose-main text-white shadow-md' : 'bg-white text-plum border border-pink-200 hover:border-rose-main'}`}>
            📦 Commandes {pending > 0 && <span className="ml-1.5 bg-white text-rose-main rounded-full px-1.5 text-xs font-bold">{pending}</span>}
          </button>
          <button onClick={() => setTab('products')}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${tab === 'products' ? 'bg-rose-main text-white shadow-md' : 'bg-white text-plum border border-pink-200 hover:border-rose-main'}`}>
            🍪 Produits
          </button>
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="flex flex-col gap-4">
            {loading && <p className="text-gray-400 text-center py-10">Chargement...</p>}
            {!loading && orders.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400">Aucune commande pour l'instant</p>
              </div>
            )}
            {orders.map(order => {
              const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-plum text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.payment_method === 'card' ? '💳 Carte' : '💬 WhatsApp'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-rose-deep text-lg">€{Number(order.total).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.color}`}>{s.label}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 flex flex-col gap-1.5">
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        <p className="text-sm text-plum">
                          {item.emoji} {item.name}
                          {item.type === 'cookie' && <span className="text-gray-400"> ×{item.quantity}</span>}
                        </p>
                        {item.contents && (
                          <div className="ml-5 flex flex-wrap gap-1 mt-1">
                            {item.contents.map((c, j) => (
                              <span key={j} className="text-xs bg-rose-blush text-plum px-2 py-0.5 rounded-full">
                                {c.emoji} {c.name} ×{c.quantity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-2">
                    {STATUS_ORDER.filter(s => s !== order.status).map(s => (
                      <button key={s} onClick={() => changeStatus(order.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all hover:shadow-sm ${STATUS_LABELS[s].color} border-current`}>
                        {STATUS_LABELS[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="flex flex-col gap-3">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-blush flex items-center justify-center text-2xl flex-shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-plum">{p.name_fr}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-rose-deep font-bold">€{Number(p.price).toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.in_stock ? '✅ En stock' : '❌ Rupture'}
                    </span>
                    {p.badge && <span className="text-xs bg-rose-blush text-rose-deep px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </div>
                </div>
                <button onClick={() => { setEditingProduct(p); setSaveError(''); }}
                  className="text-xs bg-plum text-white px-4 py-2 rounded-full hover:opacity-90 transition-all font-semibold">
                  Modifier
                </button>
              </div>
            ))}

            {/* Edit modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
                onClick={() => setEditingProduct(null)}>
                <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" />
                <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                  onClick={e => e.stopPropagation()}>
                  <h2 className="font-display text-xl font-bold text-plum mb-6">
                    {editingProduct.emoji} {editingProduct.name_fr}
                  </h2>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-semibold text-plum mb-1 block">Prix (€)</label>
                      <input type="number" step="0.5" min="0"
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum font-semibold focus:outline-none focus:border-rose-main" />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-plum mb-1 block">Badge</label>
                      <select value={editingProduct.badge ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || null })}
                        className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum focus:outline-none focus:border-rose-main">
                        <option value="">Aucun</option>
                        <option value="bestseller">Populaire</option>
                        <option value="new">Nouveau</option>
                        <option value="limited">Limité</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <span className="font-semibold text-plum text-sm">En stock</span>
                      <button onClick={() => setEditingProduct({ ...editingProduct, in_stock: !editingProduct.in_stock })}
                        className={`w-12 h-6 rounded-full transition-all relative ${editingProduct.in_stock ? 'bg-green-400' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${editingProduct.in_stock ? 'left-6' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  {saveError && (
                    <p className="text-red-500 text-xs mt-4 text-center">{saveError}</p>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setEditingProduct(null)}
                      className="flex-1 py-3 rounded-full border border-pink-200 text-plum font-semibold text-sm hover:bg-gray-50 transition-all">
                      Annuler
                    </button>
                    <button onClick={saveProduct} disabled={saving}
                      className="flex-1 py-3 rounded-full bg-rose-main text-white font-semibold text-sm hover:bg-rose-deep transition-all shadow-md disabled:opacity-60">
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
