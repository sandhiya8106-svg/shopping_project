import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronDown, X, Star, ChevronLeft, ChevronRight,
  Filter, HelpCircle, ArrowRight
} from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  "All", "Mobiles", "Laptops", "Electronics", "Headphones",
  "Smartwatches", "Fashion", "Home & Kitchen", "Books",
  "Grocery", "Accessories", "Computer Components", "Gaming"
];

const KEYWORD_GROUPS = [
  {
    title: "Popular categories",
    items: ["Mobiles", "Laptops", "Electronics", "Headphones", "Gaming", "Books"]
  },
  {
    title: "Tech essentials",
    items: ["Smartphone", "Gaming Laptop", "Earbuds", "Smartwatch", "Monitor", "RAM", "SSD"]
  },
  {
    title: "Brands",
    items: ["Apple", "Samsung", "Dell", "HP", "Asus", "OnePlus", "Sony"]
  }
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== 'All') {
      params.append('category', currentCategory);
    }
    if (currentQuery) {
      params.append('q', currentQuery);
    }
    if (currentSort) {
      params.append('sort', currentSort);
    }
    if (maxPrice < 500) {
      params.append('maxPrice', maxPrice);
    }
    if (minRating > 0) {
      params.append('minRating', minRating);
    }
    params.append('page', currentPage);
    params.append('size', 20);

    api.get(`/products?${params.toString()}`)
      .then((res) => {
        if (res.data) {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentCategory, currentSort, currentQuery, currentPage, maxPrice, minRating]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset page on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMaxPrice(500);
    setMinRating(0);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="listing-page container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{currentQuery ? "Search results" : "Shop all"}</span>
        {currentCategory !== 'All' && (
          <>
            <span>/</span>
            <span>{currentCategory}</span>
          </>
        )}
      </nav>

      {/* Listing Header */}
      <div className="listing-header">
        <div>
          <h1>{currentQuery ? `Results for “${currentQuery}”` : "The marketplace"}</h1>
          <p className="muted">
            {totalElements} matching products across the full catalog
          </p>
        </div>

        <div className="sort-control">
          <span>Sort by</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="deals">Best deals</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Customer rating</option>
          </select>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Active Search Summary */}
      {currentQuery && (
        <div className="search-summary">
          <span>
            Searching the complete ShopKart catalog for <b>“{currentQuery}”</b>
          </span>
          <button type="button" onClick={() => updateParam('q', '')}>
            <span>Clear search</span>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Keyword reference banner when searching */}
      {currentQuery && (
        <div className="keyword-reference">
          <div className="keyword-reference-heading">
            <div>
              <p className="eyebrow"><span />SEARCH SMARTER</p>
              <h2>What can you search for?</h2>
              <p>Explore popular tags, categories, and brands.</p>
            </div>
          </div>
          <div className="keyword-groups">
            {KEYWORD_GROUPS.map((grp) => (
              <div key={grp.title} className="keyword-group">
                <strong>{grp.title}</strong>
                <div>
                  {grp.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateParam('q', item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Filter Button */}
      <div className="mobile-filter-row">
        <button
          type="button"
          className="button button-outline"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <Filter size={14} />
          <span>{mobileFilterOpen ? "Hide filters" : "Filters"}</span>
        </button>
        <span>{totalElements} results</span>
      </div>

      {/* Layout Grid */}
      <div className="listing-layout">
        {/* Sidebar Filters */}
        <aside className={`filter-panel ${mobileFilterOpen ? 'mobile-show' : ''}`} style={mobileFilterOpen ? { display: 'block' } : {}}>
          <div className="filter-title">
            <strong>Filter by</strong>
            <button type="button" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h3>Category</h3>
            {CATEGORIES.map((cat) => (
              <label key={cat} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === cat}
                  onChange={() => updateParam('category', cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h3>Price range</h3>
            <div className="price-range-values">
              <span>$0</span>
              <span>Up to ${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-input"
            />
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h3>Customer rating</h3>
            {[
              { label: "4★ & up", val: 4.0 },
              { label: "3★ & up", val: 3.0 },
              { label: "All ratings", val: 0.0 }
            ].map((r) => (
              <label key={r.label} className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r.val}
                  onChange={() => setMinRating(r.val)}
                />
                <span className="rating-filter">
                  <Star size={13} fill="currentColor" />
                  <span>{r.label}</span>
                </span>
              </label>
            ))}
          </div>

          {/* Filter Help Box */}
          <div className="filter-help">
            <HelpCircle size={18} />
            <strong>Need a hand?</strong>
            <p>Our curation team is always happy to point you in the right direction.</p>
            <Link to="/products" className="text-link">
              <span>Ask us</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="listing-results">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try a broader search, a different category, or clear the filters.</p>
              <button
                type="button"
                className="button button-dark"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid four">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    disabled={currentPage === 0}
                    onClick={() => updateParam('page', currentPage - 1)}
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span>
                    Page <b>{currentPage + 1}</b> of <b>{totalPages}</b>
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => updateParam('page', currentPage + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
