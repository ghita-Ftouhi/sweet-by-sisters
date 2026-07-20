import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sweets by Sisters — Handcrafted Cookies',
  description: 'Handcrafted cookies made with love by two sisters.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen flex flex-col bg-cream">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
