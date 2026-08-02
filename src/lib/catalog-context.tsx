'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { products as bundled, type Product } from '@/data/catalog';

/**
 * The catalogue, made available to client components.
 *
 * The cart is client-side (there is no cart endpoint — see §7 of the API
 * reference), so it has to resolve slugs to products in the browser. Before
 * this existed it resolved against the *bundled* catalogue, which silently
 * dropped every live product on hydrate. The layout fetches once and hands
 * the list down.
 */
const CatalogContext = createContext<Product[]>(bundled);

export function CatalogProvider({
  products = bundled,
  children,
}: {
  products?: Product[];
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useProduct(slug: string) {
  return useCatalog().find((p) => p.slug === slug);
}
