import { fetchProducts, fetchPacks } from '@/lib/db';
import PacksClient from './PacksClient';

export default async function PacksPage() {
  const [products, packs] = await Promise.all([fetchProducts(), fetchPacks()]);
  return <PacksClient products={products} packs={packs} />;
}
