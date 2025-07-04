

// Type alias for property IDs for clarity
export type PropertyId = string;

// Enum for robust status management
export enum PropertyStatus {
  LIVE = 'LIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT', // Example additional status
  REJECTED = 'REJECTED', // Example additional status
}

// Interface for a single Property object
export interface Property {
  id: PropertyId;
  name: string;
  address: string;
  status: PropertyStatus;
  // You can add more fields here as your data model expands
  // For example:
  // createdDate?: string;
  // lastUpdated?: string;
  // contactPerson?: string;
  // phoneNumber?: string;
}

// Optional: Derived types for specific use cases (e.g., creating a new property)
// export type NewProperty = Omit<Property, 'id' | 'status'>;