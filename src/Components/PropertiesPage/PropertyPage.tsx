// src/pages/PropertiesPage.tsx
import React, { useEffect, useState } from 'react';
import PropertyTable from '../propertyTable/PropertyTable';
import PropertyFilters from '../propertyTable/PropertyFilters';
import { PropertyStatus, Property } from '../../type/Property';
import './PropertiesPage.css';
import { fetchAllHotels } from '../../service/hotel.service'; // ✅ using your custom service

const PropertiesPage: React.FC = () => {
  const [hotels, setHotels] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchAllHotels(); // ✅ call service function
        const mappedData: Property[] = data.map((hotel) => ({
          id: hotel.hotelId.toString(),
          name: hotel.hotelName,
          address: hotel.hotelAddress,
          status: PropertyStatus.LIVE, // ✅ setting default
        }));
        setHotels(mappedData);
      } catch (error) {
        console.error('❌ Failed to fetch hotels:', error);
      }
    };

    loadHotels();
  }, []);

  const filteredProperties = hotels.filter((property) => {
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
