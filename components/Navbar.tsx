'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Image from 'next/image';

const localeLabels: Record<string, string> = { en: '🇬🇧 EN', fr: '🇫🇷 FR', ar: '🇸🇦 AR' };

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/packs`, label: t('packs') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Sweet by Sisters" width={44} height={44} className="rounded-full object-cover" />
          <span className="font-display text-xl font-bold text-plum group-hover:text-rose-main transition-colors">
            Sweet <span className="text-rose-main">by</span> Sisters
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm font-medium transition-colors hover:text-rose-main ${pathname === l.href ? 'text-rose-main' : 'text-plum'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="text-xs font-semibold text-plum border border-pink-200 rounded-full px-3 py-1.5 hover:bg-rose-blush transition-colors">
              {localeLabels[locale]}
            </button>
            {langOpen && (
              <div className="absolute top-9 right-0 bg-white rounded-xl shadow-lg border border-pink-100 py-1 min-w-[90px] z-50">
                {['en', 'fr', 'ar'].map(l => (
                  <button key={l} onClick={() => switchLocale(l)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-rose-blush transition-colors ${l === locale ? 'text-rose-main font-semibold' : 'text-plum'}`}>
                    {localeLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href={`/${locale}/cart`} className="relative p-2 hover:text-rose-main transition-colors text-plum">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-main text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {/* Burger */}
          <button className="md:hidden text-plum" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-plum hover:text-rose-main transition-colors py-1">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
