'use client';
import { useState } from 'react';

export interface PackFormValues {
  id?: string;
  emoji: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  desc_en: string;
  desc_fr: string;
  desc_ar: string;
  size: number;
  price: number;
  original_price: number;
  badge: string | null;
  badge_color: string | null;
  popular: boolean;
  active: boolean;
}

export const EMPTY_PACK: PackFormValues = {
  emoji: '🎁',
  name_en: '', name_fr: '', name_ar: '',
  desc_en: '', desc_fr: '', desc_ar: '',
  size: 6,
  price: 0,
  original_price: 0,
  badge: null,
  badge_color: null,
  popular: false,
  active: true,
};

const BADGE_COLORS = [
  { value: '', label: 'Aucune' },
  { value: 'bg-rose-main', label: 'Rose' },
  { value: 'bg-gold', label: 'Or' },
  { value: 'bg-plum', label: 'Prune' },
];

export default function PackForm({ initial, onSave, onCancel }: {
  initial?: PackFormValues;
  onSave: (values: PackFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<PackFormValues>(initial ?? EMPTY_PACK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (patch: Partial<PackFormValues>) => setValues(v => ({ ...v, ...patch }));

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
          {initial ? `${values.emoji} Modifier le pack` : 'Nouveau pack'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Emoji</label>
            <input type="text" value={values.emoji}
              onChange={e => update({ emoji: e.target.value })}
              className="w-20 border border-pink-200 rounded-xl px-4 py-2.5 text-center text-2xl focus:outline-none focus:border-rose-main" />
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
            <label className="text-sm font-semibold text-plum mb-1 block">Nombre de cookies</label>
            <input type="number" step="1" min="1" value={values.size}
              onChange={e => update({ size: Number(e.target.value) })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum font-semibold focus:outline-none focus:border-rose-main" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum mb-1 block">Prix (MAD)</label>
              <input type="number" step="0.5" min="0" value={values.price}
                onChange={e => update({ price: Number(e.target.value) })}
                className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum font-semibold focus:outline-none focus:border-rose-main" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum mb-1 block">Prix barré (MAD)</label>
              <input type="number" step="0.5" min="0" value={values.original_price}
                onChange={e => update({ original_price: Number(e.target.value) })}
                className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum font-semibold focus:outline-none focus:border-rose-main" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Texte du badge</label>
            <input type="text" value={values.badge ?? ''} onChange={e => update({ badge: e.target.value || null })}
              placeholder="ex: Populaire"
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-main" />
          </div>
          <div>
            <label className="text-sm font-semibold text-plum mb-1 block">Couleur du badge</label>
            <select value={values.badge_color ?? ''} onChange={e => update({ badge_color: e.target.value || null })}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-plum focus:outline-none focus:border-rose-main">
              {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="font-semibold text-plum text-sm">Populaire (mis en avant)</span>
            <button onClick={() => update({ popular: !values.popular })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${values.popular ? 'bg-green-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${values.popular ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="font-semibold text-plum text-sm">Actif (visible sur le site)</span>
            <button onClick={() => update({ active: !values.active })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${values.active ? 'bg-green-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${values.active ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-full border border-pink-200 text-plum font-semibold text-sm hover:bg-gray-50 transition-all">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-full bg-rose-main text-white font-semibold text-sm hover:bg-rose-deep transition-all shadow-md disabled:opacity-60">
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
