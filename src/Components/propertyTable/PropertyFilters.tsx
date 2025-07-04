// src/components/PropertyFilters.tsx
import React, { useState } from 'react';
import './PropertyFilters.css';

interface PropertyFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  onSearch,
  onFilterChange,
  currentFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="property-filters">
      <div className="filter-section">
        <span className="filter-label">Filters</span>
        <div className="custom-select-wrapper">
          <select
            value={currentFilter}
            onChange={handleFilterSelect}
            className="filter-dropdown"
          >
            <option value="All">All</option>
            <option value="LIVE">Live</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
          <span className="select-arrow">&#9662;</span>
        </div>
      </div>
      <div className="search-section">
        <span className="search-icon">&#128269;</span>
        <input
          type="text"
          placeholder="Search by property name or ID"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default PropertyFilters;
