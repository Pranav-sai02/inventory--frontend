// src/pages/PropertiesPage.tsx
import React, { useState } from 'react';
import PropertyTable from '../components/propertyTable/PropertyTable';
import PropertyFilters from '../components/propertyTable/PropertyFilters';
import { Property, PropertyStatus } from '../type/Property';


import './PropertiesPage.css';

const PropertiesPage: React.FC = () => {
  const staticData: Property[] = [
    {
      id: '41365364',
      name: 'Hotel Vista',
      address: '3-12, Ayodhya nagara, Jntu Hyderabad Telangana',
      status:PropertyStatus.LIVE,
    },
    {
      id: '41265364',
      name: 'Hotel Grand Bloom',
      address: '19-3-15, e, beside Yazh Banquet Hall, Kakatiya Nagar, Tirupati, Andhra Pradesh',
      status:PropertyStatus.LIVE,
    },
    {
      id: '41001234',
      name: 'City Lights Inn',
      address: '45, Main Road, Anna Nagar, Chennai, Tamil Nadu',
      status:PropertyStatus.LIVE,
    },
    {
      id: '41556789',
      name: 'Riverside Retreat',
      address: '7, River View, Lakeside Colony, Bengaluru, Karnataka',
    status:PropertyStatus.LIVE,
    },
    {
      id: '41998877',
      name: 'Mountain View Resort',
      address: '101, Hill Top, Ooty, Tamil Nadu',
      status:PropertyStatus.LIVE,
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');

  const filteredProperties = staticData.filter((property) => {
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
