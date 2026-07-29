'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const socials = [
  {
    label: 'Instagram',
    handle: '@sweetbysisters_',
    href: 'https://www.instagram.com/sweetbysisters_',
    gradient: 'from-pink-400 to-rose-500',
    shadow: 'shadow-pink-200',
    icon: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    handle: '+212 780 615 048',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    gradient: 'from-green-400 to-emerald-500',
    shadow: 'shadow-green-200',
    icon: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    handle: 'Sweet by Sisters',
    href: 'https://www.facebook.com/share/183kCCcvJj/?mibextid=wwXIfr',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
    icon: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    handle: '@sweetbysisters',
    href: '#',
    gradient: 'from-gray-700 to-gray-900',
    shadow: 'shadow-gray-300',
    icon: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'cotact.sweetbysisters\n@gmail.com',
    href: 'mailto:cotact.sweetbysisters@gmail.com',
    gradient: 'from-rose-400 to-pink-600',
    shadow: 'shadow-rose-200',
    icon: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-cream">

      {/* Hero */}
      <div className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-blush via-pink-50 to-purple-50 opacity-60" />
        <div className="relative z-10">
          <span className="inline-block bg-white/80 text-rose-main text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-5 border border-pink-100">
            Contactez-nous
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-plum mb-4">{t('title')}</h1>
          <p className="text-gray-400 max-w-md mx-auto text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24 -mt-4">

        {/* Réseaux sociaux */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-12">
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className={`group bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm ${s.shadow} hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                <div className="scale-75">{s.icon}</div>
              </div>
              <div className="text-center">
                <p className="font-bold text-plum text-xs">{s.label}</p>
                <p className="text-gray-400 text-[10px] leading-tight mt-0.5 whitespace-pre-line">{s.handle}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-rose-main to-pink-400 px-8 py-6 text-white text-center">
            <p className="font-display text-2xl font-bold">Envoie-nous un message 💌</p>
            <p className="text-pink-100 text-sm mt-1">On répond toujours vite !</p>
          </div>

          <div className="p-8">
            {status === 'sent' ? (
              <div className="text-center py-8">
                <div className="text-7xl mb-4">💌</div>
                <h3 className="font-display text-2xl font-bold text-plum mb-2">Message envoyé !</h3>
                <p className="text-gray-400 mb-6">Nous vous répondrons très vite 🍪</p>
                <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}
                  className="bg-rose-main text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-plum block mb-2">{t('name')}</label>
                    <input required type="text" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ton prénom"
                      className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-main transition-colors bg-pink-50/30 placeholder-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-plum block mb-2">{t('email')}</label>
                    <input required type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="ton@email.com"
                      className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-main transition-colors bg-pink-50/30 placeholder-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-plum block mb-2">{t('message')}</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Écris ton message ici..."
                    className="w-full border-2 border-pink-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-main transition-colors bg-pink-50/30 resize-none placeholder-gray-300" />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    Erreur d&apos;envoi. Réessaie ou écris-nous directement sur{' '}
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline font-semibold">WhatsApp</a>.
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="bg-gradient-to-r from-rose-main to-pink-400 text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60">
                  {status === 'sending' ? 'Envoi...' : <>{t('send')} 💌</>}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
