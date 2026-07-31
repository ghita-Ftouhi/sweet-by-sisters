'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/constants';
import ProductForm, { ProductFormValues } from '@/components/admin/ProductForm';
import PackForm, { PackFormValues } from '@/components/admin/PackForm';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  payment_method: string;
  locale: string;
  items: { name: string; emoji: string; price: number; quantity: number; type: string; contents?: { name: string; emoji: string; quantity: number }[] }[];
};

type Product = ProductFormValues & { id: string };
type Pack = PackFormValues & { id: string };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: '⏳ En attente',  color: 'bg-yellow-100 text-yellow-700' },
  preparing: { label: '👩‍🍳 En préparation', color: 'bg-blue-100 text-blue-700' },
  ready:     { label: '✅ Prête',        color: 'bg-green-100 text-green-700' },
  delivered: { label: '🚚 Livrée',       color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: '❌ Annulée',      color: 'bg-red-100 text-red-600' },
};
const STATUS_ORDER = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function AdminPage() {
  const [tab, setTab] = useState<'orders' | 'products' | 'packs'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [addingPack, setAddingPack] = useState(false);

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

  const loadPacks = async () => {
    const { data } = await supabase.from('packs').select('*').order('sort_order');
    setPacks(data ?? []);
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadPacks();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const saveEditedProduct = async (values: ProductFormValues) => {
    if (!editingProduct) return;
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingProduct.id, ...values }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Erreur ${res.status}`);
    }
    setEditingProduct(null);
    loadProducts();
  };

  const createProduct = async (values: ProductFormValues) => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, sort_order: products.length + 1 }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Erreur ${res.status}`);
    }
    setAddingProduct(false);
    loadProducts();
  };

  const deleteProduct = async (p: Product) => {
    if (!window.confirm(`Supprimer "${p.name_fr}" ? Cette action est irréversible.`)) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Erreur ${res.status}`);
      return;
    }
    loadProducts();
  };

  const saveEditedPack = async (values: PackFormValues) => {
    if (!editingPack) return;
    const res = await fetch('/api/admin/packs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingPack.id, ...values }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Erreur ${res.status}`);
    }
    setEditingPack(null);
    loadPacks();
  };

  const createPack = async (values: PackFormValues) => {
    const res = await fetch('/api/admin/packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, sort_order: packs.length + 1 }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Erreur ${res.status}`);
    }
    setAddingPack(false);
    loadPacks();
  };

  const deletePack = async (p: Pack) => {
    if (!window.confirm(`Supprimer "${p.name_fr}" ? Cette action est irréversible.`)) return;
    const res = await fetch('/api/admin/packs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Erreur ${res.status}`);
      return;
    }
    loadPacks();
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
          <button onClick={() => setTab('packs')}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${tab === 'packs' ? 'bg-rose-main text-white shadow-md' : 'bg-white text-plum border border-pink-200 hover:border-rose-main'}`}>
            🎁 Packs
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
                      <p className="font-display font-bold text-rose-deep text-lg">{formatPrice(Number(order.total))}</p>
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
            <button onClick={() => setAddingProduct(true)}
              className="self-start text-sm bg-plum text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all font-semibold mb-2">
              + Ajouter un produit
            </button>

            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-blush flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden relative">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    p.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-plum">{p.name_fr}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-rose-deep font-bold">{formatPrice(Number(p.price))}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.in_stock ? '✅ En stock' : '❌ Rupture'}
                    </span>
                    {p.badge && <span className="text-xs bg-rose-blush text-rose-deep px-2 py-0.5 rounded-full">{p.badge}</span>}
                    {!p.box_eligible && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hors box</span>}
                  </div>
                </div>
                <button onClick={() => setEditingProduct(p)}
                  className="text-xs bg-plum text-white px-4 py-2 rounded-full hover:opacity-90 transition-all font-semibold">
                  Modifier
                </button>
                <button onClick={() => deleteProduct(p)}
                  className="text-xs bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-all font-semibold">
                  Supprimer
                </button>
              </div>
            ))}

            {editingProduct && (
              <ProductForm
                initial={editingProduct}
                onCancel={() => setEditingProduct(null)}
                onSave={saveEditedProduct}
              />
            )}

            {addingProduct && (
              <ProductForm
                initial={undefined}
                onCancel={() => setAddingProduct(false)}
                onSave={createProduct}
              />
            )}
          </div>
        )}

        {/* PACKS TAB */}
        {tab === 'packs' && (
          <div className="flex flex-col gap-3">
            <button onClick={() => setAddingPack(true)}
              className="self-start text-sm bg-plum text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all font-semibold mb-2">
              + Ajouter un pack
            </button>

            {packs.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-blush flex items-center justify-center text-2xl flex-shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-plum">{p.name_fr}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-rose-deep font-bold">{formatPrice(Number(p.price))}</span>
                    <span className="text-xs text-gray-400">{p.size} cookies</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.active ? '✅ Actif' : '❌ Inactif'}
                    </span>
                    {p.badge && <span className="text-xs bg-rose-blush text-rose-deep px-2 py-0.5 rounded-full">{p.badge}</span>}
                    {p.popular && <span className="text-xs bg-gold/20 text-plum px-2 py-0.5 rounded-full">⭐ Populaire</span>}
                  </div>
                </div>
                <button onClick={() => setEditingPack(p)}
                  className="text-xs bg-plum text-white px-4 py-2 rounded-full hover:opacity-90 transition-all font-semibold">
                  Modifier
                </button>
                <button onClick={() => deletePack(p)}
                  className="text-xs bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-all font-semibold">
                  Supprimer
                </button>
              </div>
            ))}

            {editingPack && (
              <PackForm
                initial={editingPack}
                onCancel={() => setEditingPack(null)}
                onSave={saveEditedPack}
              />
            )}

            {addingPack && (
              <PackForm
                initial={undefined}
                onCancel={() => setAddingPack(false)}
                onSave={createPack}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
