import React from 'react';
import { Search } from 'lucide-react';

const SUGGESTIONS = [
  "Laptop", "Mobile", "Headphones", "Samsung", "Gaming", "Books",
  "Smartwatch", "Earbuds", "Shoes", "Keyboard", "Mouse", "Refrigerator",
  "Apple", "Dell", "HP", "Asus", "OnePlus", "T-Shirt", "Cookware", "Python Book"
];

export default function SearchAutocomplete({ query, onSelect, onClose }) {
  const filtered = query.trim()
    ? SUGGESTIONS.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : SUGGESTIONS.slice(0, 6);

  if (filtered.length === 0) return null;

  return (
    <div className="search-autocomplete" role="listbox">
      <p>{query.trim() ? "Matching searches" : "Popular searches"}</p>
      {filtered.map((item) => (
        <button
          key={item}
          type="button"
          role="option"
          onClick={() => {
            onSelect(item);
            onClose();
          }}
        >
          <Search size={13} />
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}
