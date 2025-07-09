// src/pages/PropertiesPage.tsx
import React, { useState } from 'react';
import PropertyTable from '../propertyTable/PropertyTable';
import PropertyFilters from '../propertyTable/PropertyFilters';
import { PropertyStatus, Property } from '../../type/Property';
import './PropertiesPage.css';
import { useHotels } from '../../hooks/useHotels'; // ✅ React Query hook

const PropertiesPage: React.FC = () => {
  const { data: hotelsData, isLoading, isError } = useHotels(); // ✅ get all hotels from API

  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');

  const mappedHotels: Property[] = hotelsData?.map((hotel) => ({
    id: hotel.hotelId.toString(),
    name: hotel.hotelName,
    address: hotel.hotelAddress,
    status: PropertyStatus.LIVE, // ✅ default status
  })) || [];

  const filteredProperties = mappedHotels.filter((property) => {
    const matchesFilter = currentFilter === 'All' || property.status === currentFilter;
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleActionClick = (propertyId: string) => {
    alert(`Action clicked for property ID: ${propertyId}`);
  };

  if (isLoading) return <p>Loading hotels...</p>;
  if (isError) return <p>Error loading hotels.</p>;

  return (
    <div className="properties-page">
      <div className="page-header">
        <h2>Property Details</h2>
      </div>

      <PropertyFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
      />

      <PropertyTable
        properties={filteredProperties}
        onActionClick={handleActionClick}
      />
    </div>
  );
};

export default PropertiesPage;
