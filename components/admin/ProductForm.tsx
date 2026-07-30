'use client';
import { useState } from 'react';

export interface ProductFormValues {
  id?: string;
  emoji: string;
  images: string[];
  name_en: string;
  name_fr: string;
  name_ar: string;
  desc_en: string;
  desc_fr: string;
  desc_ar: string;
  price: number;
  in_stock: boolean;
  badge: string | null;
  box_eligible: boolean;
}

export const EMPTY_PRODUCT: ProductFormValues = {
  emoji: '🍪',
  images: [],
  name_en: '', name_fr: '', name_ar: '',
  desc_en: '', desc_fr: '', desc_ar: '',
  price: 0,
  in_stock: true,
  badge: null,
  box_eligible: true,
};

export default function ProductForm({ initial, onSave, onCancel }: {
  initial?: ProductFormValues;
  onSave: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const update = (patch: Partial<ProductFormValues>) => setValues(v => ({ ...v, ...patch }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur upload');
        return;
      }
      update({ images: [...values.images, data.url] });
    } catch {
      setError('Erreur de connexion');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => update({ images: values.images.filter(i => i !== url) });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8" onClick={onCancel}>
      <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-xl font-bold text-plum mb-6">
          {initial ? `${values.emoji} Modifier le produit` : 'Nouveau produit'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Emoji</label>
            <input type="text" value={values.emoji}
              onChange={e => update({ emoji: e.target.value })}
              className="w-20 border border-pink-200 rounded-xl px-4 py-2.5 text-center text-2xl focus:outline-none focus:border-rose-main" />
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Photos</label>
            {values.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {values.images.map(url => (
                  <div key={url} className="relative w-16 h-16 rounded-xl overflow-hidden border border-pink-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(url)}
                      className="absolute top-0.5 right-0.5 bg-plum/70 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
              className="text-xs text-gray-500" />
            {uploading && <p className="text-xs text-gray-400 mt-1">Envoi en cours...</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Nom (Français)</label>
            <input type="text" value={values.name_fr} onChange={e => update({ name_fr: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-main" />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Nom (Anglais)</label>
            <input type="text" value={values.name_en} onChange={e => update({ name_en: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-main" />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Nom (Arabe)</label>
            <input type="text" dir="rtl" value={values.name_ar} onChange={e => update({ name_ar: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-main" />
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Description (Français)</label>
            <textarea rows={2} value={values.desc_fr} onChange={e => update({ desc_fr: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-main resize-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Description (Anglais)</label>
            <textarea rows={2} value={values.desc_en} onChange={e => update({ desc_en: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-main resize-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Description (Arabe)</label>
            <textarea rows={2} dir="rtl" value={values.desc_ar} onChange={e => update({ desc_ar: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-main resize-none" />
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Prix (MAD)</label>
            <input type="number" step="0.5" min="0" value={values.price}
              onChange={e => update({ price: Number(e.target.value) })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum font-semibold focus:outline-none focus:border-rose-main" />
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Badge</label>
            <select value={values.badge ?? ''} onChange={e => update({ badge: e.target.value || null })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum focus:outline-none focus:border-rose-main">
              <option value="">Aucun</option>
              <option value="bestseller">Populaire</option>
              <option value="new">Nouveau</option>
              <option value="limited">Limité</option>
            </select>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="font-semibold text-plum text-sm">En stock</span>
            <button onClick={() => update({ in_stock: !values.in_stock })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${values.in_stock ? 'bg-green-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${values.in_stock ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <span className="font-semibold text-plum text-sm block">Vendable dans &quot;Composer ma box&quot;</span>
              <span className="text-xs text-gray-400">À désactiver pour les produits vendus au sachet/boîte (pas à l&apos;unité)</span>
            </div>
            <button onClick={() => update({ box_eligible: !values.box_eligible })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ml-3 ${values.box_eligible ? 'bg-green-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${values.box_eligible ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-full border border-pink-200 text-plum font-semibold text-sm hover:bg-gray-50 transition-all">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving || uploading}
            className="flex-1 py-3 rounded-full bg-rose-main text-white font-semibold text-sm hover:bg-rose-deep transition-all shadow-md disabled:opacity-60">
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
