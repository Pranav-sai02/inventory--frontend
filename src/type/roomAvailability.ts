// src/type/roomAvailability.ts

export interface RoomAvailabilityDTO {
  roomId: number;
  roomName: string;
  availableCount: number;
}

export interface SaveInventoryRequest {
  hotelId: number;
  fromDate: string; // use 'YYYY-MM-DD' format
  toDate: string;
  rooms: RoomAvailabilityDTO[];
}
