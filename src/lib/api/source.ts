import 'server-only';

import { api } from './endpoints';
import { toProduct, toReview, withFallback } from './adapt';
import type { Category, Product } from '@/data/catalog';
import { categories as staticCategories, products as staticProducts } from '@/data/catalog';
import { reviews as staticReviews } from '@/data/content';

/**
 * Server-side reads. Every one of these calls the real API first and falls
 * back to the bundled placeholder if the backend is not reachable, so the
 * prototype keeps rendering with nothing running on :5000.
 *
 * `live` comes back with the data so a screen can say which it is showing.
 */

/**
 * A live call that comes back empty is not an outage, but it does blank a
 * section — and a storefront with no products or no testimonials reads as
 * broken. Empty is treated as "nothing to show yet" and hands over to the
 * bundled copy, exactly like an unreachable backend does.
 */
function orFallback<T>(list: T[]): T[] {
  if (!list.length) throw new Error('empty');
  return list;
}

export async function getProducts() {
  return withFallback(
    async () => {
      // limit is capped at 100 by the API; the catalogue is far smaller.
      const r = await api.catalog.products({ limit: 100, sort: 'sequence' });
      return orFallback(r.data.map(toProduct));
    },
    staticProducts,
    'catalog/products',
  );
}

export async function getProduct(slug: string) {
  return withFallback(
    async () => toProduct((await api.catalog.product(slug)).data),
    staticProducts.find((p) => p.slug === slug),
    `catalog/products/${slug}`,
  );
}

export async function getCategories(): Promise<{ value: Category[]; live: boolean }> {
  return withFallback(
    async () => {
      const r = await api.catalog.categories(false);
      const live: Category[] = orFallback(r.data).map((c) => ({
        slug: c.slug,
        name: c.name,
        image: c.catImage || '/img/cat1.jpg',
      }));
      // 'Service' is a navigation destination the API has no concept of, so
      // it is appended rather than expected back from the server.
      const service = staticCategories.find((c) => c.href);
      return service ? [...live, service] : live;
    },
    staticCategories,
    'catalog/categories',
  );
}

export async function getFeatured(limit = 3): Promise<{ value: Product[]; live: boolean }> {
  return withFallback(
    async () => {
      const r = await api.catalog.products({ isTopSeller: true, limit });
      return orFallback(r.data.map(toProduct));
    },
    staticProducts.filter((p) => p.badge === 'Bestseller').slice(0, limit),
    'catalog/products?isTopSeller',
  );
}

export async function getReviews() {
  return withFallback(
    async () => {
      const r = await api.content.reviews();
      const featured = r.data.filter((x) => x.featured);
      return orFallback((featured.length ? featured : r.data).map(toReview));
    },
    staticReviews,
    'content/reviews',
  );
}

export async function getCertifications() {
  return withFallback(
    async () => (await api.content.certifications(true)).data,
    [],
    'content/certifications',
  );
}

/*
 * `/auth/me`, `/orders/mine` and `/orders/:id` are deliberately absent.
 * They are bearer-token routes and the token only ever exists in the browser
 * — the refresh cookie is scoped to the API origin, so this server never sees
 * it. Reading them here could only ever 401 into placeholder data, which is
 * worse than useless: it shows a stranger's account. They are fetched
 * client-side instead (AccountView, OrderDetail).
 */
