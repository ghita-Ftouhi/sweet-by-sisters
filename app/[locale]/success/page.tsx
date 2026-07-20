'use client';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function SuccessPage() {
  const { clear } = useCart();
  const locale = useLocale();

  useEffect(() => { clear(); }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="font-display text-3xl font-bold text-plum mb-3">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">Merci pour votre commande 💕</p>
        <p className="text-gray-400 text-sm mb-8">
          Vous recevrez une confirmation par email. Nous vous contacterons pour la livraison.
        </p>
        <div className="bg-rose-blush rounded-2xl p-4 mb-8">
          <p className="text-rose-deep font-semibold text-sm">✅ Paiement sécurisé par Stripe</p>
        </div>
        <Link href={`/${locale}`}
          className="bg-rose-main text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md inline-block">
          Retour à l'accueil 🍪
        </Link>
      </div>
    </div>
  );
}
