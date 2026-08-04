'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Search, Bell, Sliders } from './Icons';
import CartBadge from './CartBadge';
import ProductCard from './ProductCard';
import {
  categories as fallbackCategories,
  products as fallbackProducts,
  type Category,
  type Product,
} from '@/data/catalog';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const SORTS: Array<{ id: Sort; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
];

/** Three bands rather than a slider — the catalogue runs ₹1,800 to ₹24,900. */
const BANDS: Array<{ id: string; label: string; test: (p: Product) => boolean }> = [
  { id: 'under5', label: 'Under ₹5,000', test: (p) => p.price < 5000 },
  { id: 'mid', label: '₹5,000 – ₹15,000', test: (p) => p.price >= 5000 && p.price <= 15000 },
  { id: 'over15', label: 'Above ₹15,000', test: (p) => p.price > 15000 },
];

/**
 * Search + results for /shop. The category filter is the image rail above
 * it, which navigates to ?c=<slug> — so this owns the text query, the sort
 * and the extra filters.
 *
 * The search bar is the screen's top bar, so anything that belongs between
 * it and the results (the category rail) comes in as `children` — that way
 * it stays a server component.
 */
export default function ShopBrowser({
  active,
  children,
  products = fallbackProducts,
  categories = fallbackCategories,
}: {
  active?: string;
  children?: ReactNode;
  products?: Product[];
  categories?: Category[];
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<Sort>('featured');
  const [band, setBand] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [offer, setOffer] = useState(false);

  const menu = useRef<HTMLDivElement>(null);

  const category = categories.find((c) => c.slug === active);
  const touched = sort !== 'featured' || band !== null || inStock || offer;

  // Dropdown manners: a tap anywhere else, or Escape, closes it.
  useEffect(() => {
    if (!open) return;

    const onDown = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const bandTest = BANDS.find((b) => b.id === band)?.test;

    const filtered = products.filter((p) => {
      const inCategory = !active || p.categorySlug === active;
      const matches =
        !needle || `${p.name} ${p.subtitle} ${p.categorySlug}`.toLowerCase().includes(needle);
      return (
        inCategory &&
        matches &&
        (!bandTest || bandTest(p)) &&
        (!inStock || p.inStock) &&
        (!offer || p.mrp !== undefined)
      );
    });

    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      default:
        // Featured = bestsellers first, then the catalogue's own order within
        // each half. An explicit sort is left alone: someone who asked for
        // cheapest-first does not want two of them jumped to the top.
        return [
          ...filtered.filter((p) => p.badge === 'Bestseller'),
          ...filtered.filter((p) => p.badge !== 'Bestseller'),
        ];
    }
  }, [active, query, sort, band, inStock, offer, products]);

  const clear = () => {
    setSort('featured');
    setBand(null);
    setInStock(false);
    setOffer(false);
  };

  return (
    <>
      <header className="shop-head">
        {/* One row that never wraps: the field flexes, the two actions never
            leave its right-hand side however narrow the phone gets. */}
        <div className="shop-head__row">
          <div className="search">
            <Search className="icon icon--sm" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search purifiers, parts…"
              aria-label="Search products"
            />
          </div>

          <div className="shop-head__actions">
            <Link href="/account" className="tap" aria-label="Notifications">
              <Bell className="icon" />
            </Link>
            <CartBadge />
          </div>
        </div>
      </header>

      {children}

      {/* The filter lives with the count it changes, not in the search field:
          the number to its left is the only feedback a filter gives, and the
          panel drops directly over the grid it is narrowing. */}
      <div className="result-head" ref={menu}>
        <h2>{category ? category.name : 'All Products'}</h2>
        <div className="result-head__end">
          <span>
            {results.length} {results.length === 1 ? 'item' : 'items'}
          </span>
          <button
            type="button"
            className="search__filter"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="shop-filters"
            aria-label="Filter and sort"
            data-touched={touched || undefined}
          >
            <Sliders className="icon icon--sm" />
          </button>

          {/* A dropdown hung off the bar rather than a sheet over the page —
              the results stay put behind it, so the count you are changing
              never jumps. */}
          {open && (
            <div className="filters" id="shop-filters">
              <div className="filters__group">
                <span className="filters__label">Sort</span>
                <div className="chips">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="chip"
                      data-active={sort === s.id || undefined}
                      aria-pressed={sort === s.id}
                      onClick={() => setSort(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filters__group">
                <span className="filters__label">Price</span>
                <div className="chips">
                  {BANDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="chip"
                      data-active={band === b.id || undefined}
                      aria-pressed={band === b.id}
                      onClick={() => setBand((v) => (v === b.id ? null : b.id))}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filters__group">
                <span className="filters__label">Show only</span>
                <div className="chips">
                  <button
                    type="button"
                    className="chip"
                    data-active={inStock || undefined}
                    aria-pressed={inStock}
                    onClick={() => setInStock((v) => !v)}
                  >
                    In stock
                  </button>
                  <button
                    type="button"
                    className="chip"
                    data-active={offer || undefined}
                    aria-pressed={offer}
                    onClick={() => setOffer((v) => !v)}
                  >
                    On offer
                  </button>
                </div>
              </div>

              {touched && (
                <button type="button" className="filters__clear" onClick={clear}>
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid" style={{ paddingTop: 0 }}>
          {results.map((p) => (
            // The bestsellers earn the full row — they are what the shop is
            // meant to sell first.
            <ProductCard key={p.slug} product={p} wide={p.badge === 'Bestseller'} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <span className="empty__bubble">
            <Search />
          </span>
          <h2>Nothing matched</h2>
          <p>
            {query.trim()
              ? `No products for “${query.trim()}”. Try a shorter search, or loosen the filters.`
              : 'No products match these filters. Try widening the price band.'}
          </p>
          {touched && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
