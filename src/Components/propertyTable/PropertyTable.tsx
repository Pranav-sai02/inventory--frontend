// src/components/PropertyTable.tsx
import React from 'react';
import { Property } from '../../type/Property';
import './PropertyTable.css';

interface PropertyTableProps {
  properties: Property[];
  onActionClick: (propertyId: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onActionClick }) => {
  return (
    <div className="property-table-container">
      <table>
        <thead>
          <tr>
            <th>Property ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.id}</td>
              <td>
                <div className="property-name">{property.name}</div>
                <div className="property-address">{property.address}</div>
              </td>
              <td>
                <span className={`property-status status-${property.status.toLowerCase()}`}>
                  {property.status}
                </span>
              </td>
              <td>
                <button
                  className="action-button"
                  onClick={() => onActionClick(property.id)}
                >
                  &#x22EE;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
