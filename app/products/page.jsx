"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@slices/authSlice";
import { useProductsGetMutation, useProductsCategoriesGetMutation } from "@slices/productsApiSlice";
import ProductCard from "@components/ProductCard";
import styles from "./products.module.css";

const slugifyCategory = (name) =>
  (name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

const slugForBackend = (name) =>
  (name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const Products = () => {
  const toast = useToast();
  const router = useRouter();
  const { userInfo } = useAuth();

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePill, setActivePill] = useState("all");
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState([]);
  const [sort, setSort] = useState("price-asc");

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100000 });

  const [visibleCount, setVisibleCount] = useState(12);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const [fetchProducts] = useProductsGetMutation();
  const [fetchCategories] = useProductsCategoriesGetMutation();

  useEffect(() => {
    let cancelled = false;

    async function load() {
    try {
      setIsLoading(true);
        const [productsRes, catsRes] = await Promise.allSettled([
          fetchProducts().unwrap(),
          fetchCategories().unwrap(),
        ]);

        if (cancelled) return;

        if (productsRes.status === "fulfilled" && productsRes.value?.status === "Success") {
          const data = Array.isArray(productsRes.value.data) ? productsRes.value.data : [];
          setAllProducts(data);
          setProducts(data);
          if (data.length) {
            const prices = data
              .map((p) => Number(p.price) || 0)
              .filter((n) => Number.isFinite(n) && n >= 0);
            if (prices.length) {
              const min = Math.min(...prices);
              const max = Math.max(...prices);
              setPriceBounds({ min, max });
              setPriceMin(min);
              setPriceMax(max);
            }
          }
        } else if (productsRes.status === "rejected") {
          throw productsRes.reason;
        }

        if (catsRes.status === "fulfilled" && catsRes.value?.success && catsRes.value?.categories) {
          const mapped = catsRes.value.categories.map((c) => ({
            id: c._id || c.id || c.name,
            name: c.name,
            count: c.count ?? c.total ?? undefined,
            slug: slugifyCategory(c.name),
            apiSlug: slugForBackend(c.name),
          }));
          setCategories(mapped);
      }
    } catch (error) {
        console.error("Error loading products:", error);
        toast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchProducts, fetchCategories, toast]);

  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => (p.name || "").toString().toLowerCase().includes(term));
    }

    if (selectedCategorySlugs.length) {
      list = list.filter((p) => {
        const slug = slugifyCategory(p.category || p.categoryName || "");
        return selectedCategorySlugs.includes(slug);
      });
    }

    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceMin && price <= priceMax;
    });

    if (sort === "price-asc") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "price-desc") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sort === "popular") {
      list.sort(
        (a, b) =>
          (Number(b.ordersCount) || Number(b.reviewCount) || 0) -
          (Number(a.ordersCount) || Number(a.reviewCount) || 0)
      );
    }

    return list;
  }, [products, searchTerm, selectedCategorySlugs, priceMin, priceMax, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (selectedCategorySlugs.length) {
      const map = new Map(categories.map((c) => [c.slug, c.name]));
      selectedCategorySlugs.forEach((slug) => {
        const name = map.get(slug) || slug;
        chips.push({ type: "category", value: slug, label: name });
      });
    }
    if (sort === "price-asc") chips.push({ type: "sort", value: "price-asc", label: "Price: Low–High" });
    else if (sort === "price-desc") chips.push({ type: "sort", value: "price-desc", label: "Price: High–Low" });
    else if (sort === "popular") chips.push({ type: "sort", value: "popular", label: "Most Popular" });
    if (priceMin > priceBounds.min || priceMax < priceBounds.max) {
      chips.push({
        type: "price",
        value: "price-range",
        label: `UGX ${priceMin.toLocaleString()}–${priceMax.toLocaleString()}`,
      });
    }
    return chips;
  }, [categories, selectedCategorySlugs, sort, priceMin, priceMax, priceBounds.min, priceBounds.max]);

  const filterBadgeCount = activeFilterChips.length;

  const handleBack = () => {
    router.back();
  };

  const handlePillClick = (slug) => {
    setActivePill(slug);
    if (slug === "all") {
      setSelectedCategorySlugs([]);
    } else {
      setSelectedCategorySlugs([slug]);
    }
    setVisibleCount(12);
  };

  const handleToggleCategory = (slug) => {
    setSelectedCategorySlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      if (next.length === 0) setActivePill("all");
      else if (next.length === 1) setActivePill(next[0]);
      else setActivePill("multi");
      return next;
    });
    setVisibleCount(12);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleClearAllFilters = () => {
    setSelectedCategorySlugs([]);
    setSort("price-asc");
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setActivePill("all");
    setVisibleCount(12);
  };

  const handleRemoveChip = (chip) => {
    if (chip.type === "category") {
      handleToggleCategory(chip.value);
    } else if (chip.type === "sort") {
      setSort("price-asc");
    } else if (chip.type === "price") {
      setPriceMin(priceBounds.min);
      setPriceMax(priceBounds.max);
    }
  };

  const handleRangeChange = (min, max) => {
    const safeMin = Math.max(priceBounds.min, Math.min(min, max));
    const safeMax = Math.min(priceBounds.max, Math.max(min, max));
    setPriceMin(safeMin);
    setPriceMax(safeMax);
    setVisibleCount(12);
  };

  const handleDesktopRangeChange = (e, which) => {
    const value = Number(e.target.value) || 0;
    if (which === "min") {
      handleRangeChange(value, priceMax);
    } else {
      handleRangeChange(priceMin, value);
    }
  };

  const handleMobileRangeChange = (e, which) => {
    const value = Number(e.target.value) || 0;
    if (which === "min") {
      handleRangeChange(value, priceMax);
    } else {
      handleRangeChange(priceMin, value);
    }
  };

  const priceToPercent = (value) => {
    if (priceBounds.max === priceBounds.min) return 0;
    return ((value - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const renderSidebarFilters = () => (
    <>
      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          Price Range (UGX)
        </div>
        <div className={styles.priceRangeDisplay}>
          <div className={styles.priceVal}>{priceMin.toLocaleString()}</div>
          <div className={styles.priceVal}>{priceMax.toLocaleString()}</div>
        </div>
        <div className={styles.rangeWrap}>
          <div className={styles.rangeTrack} />
          <div
            className={styles.rangeFill}
            style={{
              left: `${priceToPercent(priceMin)}%`,
              right: `${100 - priceToPercent(priceMax)}%`,
            }}
          />
          <input
            type="range"
            className={styles.rangeInput}
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceMin}
            onChange={(e) => handleDesktopRangeChange(e, "min")}
          />
          <input
            type="range"
            className={styles.rangeInput}
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceMax}
            onChange={(e) => handleDesktopRangeChange(e, "max")}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          Sort By
        </div>
        <div className={styles.sortOptions}>
          {[
            { value: "relevance", label: "Relevance" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "popular", label: "Most Popular" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.sortOpt} ${sort === opt.value ? styles.sortOptActive : ""}`}
              onClick={() => handleSortChange(opt.value)}
            >
              <span className={styles.sortOptLabel}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3h18M8 12h13M13 21h8" />
                </svg>
                {opt.label}
              </span>
              <span className={styles.sortRadio}>
                {sort === opt.value && <span className={styles.sortRadioInner} />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Categories
        </div>
        <div className={styles.catList}>
          {categories.map((cat) => {
            const checked = selectedCategorySlugs.includes(cat.slug);
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catCheckItem} ${checked ? styles.catCheckItemChecked : ""}`}
                onClick={() => handleToggleCategory(cat.slug)}
              >
                <div className={styles.catCheckLeft}>
                  <div className={styles.catCheckIcon}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 8C8 10 5.9 16.17 3.82 19.25A13 13 0 0015 21c3.87 0 7-3.13 7-7 0-2.5-1-4.75-5-6z" />
                    </svg>
                  </div>
                  <span className={styles.catCheckName}>{cat.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {cat.count != null && <span className={styles.catCheckCount}>{cat.count}</span>}
                  <span className={styles.checkbox}>
                    {checked && (
                      <svg
                        className={styles.checkboxIcon}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <div className={styles.topbar}>
          <button type="button" className={styles.topbarBack} onClick={handleBack} aria-label="Go back">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className={styles.topbarSearch}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(12);
              }}
            />
          </div>
          <button
            type="button"
            className={`${styles.topbarFilterBtn} ${styles.mobileOnly}`}
            onClick={() => setMobileFilterOpen(true)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            {filterBadgeCount > 0 && <span className={styles.filterBadge}>{filterBadgeCount}</span>}
          </button>
        </div>

        <div className={styles.heroStrip}>
          <div className={styles.heroStripLabel}>YooKatale Market</div>
          <div className={styles.heroStripTitle}>
            All <span className={styles.heroStripTitleYoo}>Categories</span>
          </div>
          <div className={styles.heroStripSub}>
            Browse {filteredProducts.length} fresh product{filteredProducts.length === 1 ? "" : "s"} across all
            categories
          </div>
        </div>

        <div className={styles.catScrollWrap}>
          <div className={styles.catScroll}>
            <button
              type="button"
              className={`${styles.catPill} ${activePill === "all" ? styles.catPillActive : ""}`}
              onClick={() => handlePillClick("all")}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catPill} ${activePill === cat.slug ? styles.catPillActive : ""}`}
                onClick={() => handlePillClick(cat.slug)}
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.mainLayout}>
          <aside className={styles.desktopSidebar}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                      Filters
              </div>
              {activeFilterChips.length > 0 && (
                <button type="button" className={styles.sheetClear} onClick={handleClearAllFilters}>
                  Clear all
                </button>
              )}
            </div>
            <div className={styles.desktopSidebarBody}>{renderSidebarFilters()}</div>
          </aside>

          <div>
            <div className={styles.resultsBar}>
              <div className={styles.resultsCount}>
                All Products <span>{filteredProducts.length} found</span>
              </div>
              <button type="button" className={styles.sortBtn} onClick={() => setMobileSortOpen(true)}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
                Sort
              </button>
            </div>

            <div
              className={`${styles.activeFilters} ${
                activeFilterChips.length ? styles.activeFiltersShow : ""
              }`}
            >
              {activeFilterChips.map((chip) => (
                <div key={`${chip.type}-${chip.value}`} className={styles.afChip}>
                  {chip.label}
                  <svg
                    onClick={() => handleRemoveChip(chip)}
                    onKeyDown={(e) => e.key === "Enter" && handleRemoveChip(chip)}
                    role="button"
                    tabIndex={0}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              ))}
            </div>

            <div className={styles.gridWrap}>
              <div className={`${styles.productGrid} prod-grid`}>
                {isLoading ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8M8 16h5" />
                      </svg>
                    </div>
                    <div className={styles.emptyTitle}>Loading products…</div>
                    <div className={styles.emptySub}>Please wait while we fetch fresh items.</div>
                  </div>
                ) : visibleProducts.length ? (
                  visibleProducts.map((product) => (
                    <ProductCard key={product._id} product={product} userInfo={userInfo} variant="v4" />
                        ))
                      ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8M8 16h5" />
                      </svg>
                    </div>
                    <div className={styles.emptyTitle}>No products found</div>
                    <div className={styles.emptySub}>
                      Try adjusting your search or filters to find what you need.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isLoading && visibleProducts.length < filteredProducts.length && (
              <div className={styles.loadMoreWrap}>
                <button type="button" className={styles.loadMoreBtn} onClick={handleLoadMore}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                  </svg>
                  Load more products
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile filter bottom sheet */}
        <div
          className={`${styles.filterOverlay} ${mobileFilterOpen ? styles.filterOverlayOpen : ""}`}
          onClick={() => setMobileFilterOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileFilterOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close filters"
        />
        <div className={`${styles.filterSheet} ${mobileFilterOpen ? styles.filterSheetOpen : ""}`}>
          <div className={styles.sheetHandle} />
          <div className={styles.sheetHeader}>
            <div className={styles.sheetTitle}>
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters &amp; Sort
            </div>
            {activeFilterChips.length > 0 && (
              <button type="button" className={styles.sheetClear} onClick={handleClearAllFilters}>
                Clear all
              </button>
            )}
          </div>
          <div className={styles.sheetBody}>
            <div className={styles.filterSection}>
              <div className={styles.filterSectionTitle}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
                Sort By
              </div>
              <div className={styles.sortOptions}>
                {[
                  { value: "relevance", label: "Relevance" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "popular", label: "Most Popular" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.sortOpt} ${sort === opt.value ? styles.sortOptActive : ""}`}
                    onClick={() => handleSortChange(opt.value)}
                  >
                    <span className={styles.sortOptLabel}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 3h18M8 12h13M13 21h8" />
                      </svg>
                      {opt.label}
                    </span>
                    <span className={styles.sortRadio}>
                      {sort === opt.value && <span className={styles.sortRadioInner} />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <div className={styles.filterSectionTitle}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                Price Range (UGX)
              </div>
              <div className={styles.priceRangeDisplay}>
                <div className={styles.priceVal}>{priceMin.toLocaleString()}</div>
                <div className={styles.priceVal}>{priceMax.toLocaleString()}</div>
              </div>
              <div className={styles.rangeWrap}>
                <div className={styles.rangeTrack} />
                <div
                  className={styles.rangeFill}
                  style={{
                    left: `${priceToPercent(priceMin)}%`,
                    right: `${100 - priceToPercent(priceMax)}%`,
                  }}
                />
                <input
                  type="range"
                  className={styles.rangeInput}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMin}
                  onChange={(e) => handleMobileRangeChange(e, "min")}
                />
                <input
                  type="range"
                  className={styles.rangeInput}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMax}
                  onChange={(e) => handleMobileRangeChange(e, "max")}
                />
              </div>
            </div>

            <div className={styles.filterSection}>
              <div className={styles.filterSectionTitle}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Categories
              </div>
              <div className={styles.catList}>
                {categories.map((cat) => {
                  const checked = selectedCategorySlugs.includes(cat.slug);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles.catCheckItem} ${checked ? styles.catCheckItemChecked : ""}`}
                      onClick={() => handleToggleCategory(cat.slug)}
                    >
                      <div className={styles.catCheckLeft}>
                        <div className={styles.catCheckIcon}>
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 8C8 10 5.9 16.17 3.82 19.25A13 13 0 0015 21c3.87 0 7-3.13 7-7 0-2.5-1-4.75-5-6z" />
                          </svg>
                        </div>
                        <span className={styles.catCheckName}>{cat.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {cat.count != null && <span className={styles.catCheckCount}>{cat.count}</span>}
                        <span className={styles.checkbox}>
                          {checked && (
                            <svg
                              className={styles.checkboxIcon}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.sheetFooter}>
            <button type="button" className={styles.btnOutline} onClick={() => setMobileFilterOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnApply}
              onClick={() => setMobileFilterOpen(false)}
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>

        {/* Mobile sort sheet */}
        <div
          className={`${styles.filterOverlay} ${mobileSortOpen ? styles.filterOverlayOpen : ""}`}
          onClick={() => setMobileSortOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileSortOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sort"
        />
        <div className={`${styles.sortSheet} ${mobileSortOpen ? styles.sortSheetOpen : ""}`}>
          <div className={styles.sheetHandle} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 2px" }}>
            <h2 className={styles.sheetTitle} style={{ margin: 0 }}>
              Sort Products
            </h2>
            <button
              type="button"
              className={styles.sheetCloseBtn}
              onClick={() => setMobileSortOpen(false)}
              aria-label="Close sort"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className={styles.sortOptions}>
            {[
              { value: "relevance", label: "Relevance" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
              { value: "popular", label: "Most Popular" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.sortOpt} ${sort === opt.value ? styles.sortOptActive : ""}`}
                onClick={() => handleSortChange(opt.value)}
              >
                <span className={styles.sortOptLabel}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <path d="M3 3h18M8 12h13M13 21h8" />
                  </svg>
                  {opt.label}
                </span>
                <span className={styles.sortRadio}>
                  {sort === opt.value && <span className={styles.sortRadioInner} />}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.btnApply}
            style={{ marginTop: 16, marginBottom: 16, width: "100%" }}
            onClick={() => setMobileSortOpen(false)}
          >
            Apply Sort
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
