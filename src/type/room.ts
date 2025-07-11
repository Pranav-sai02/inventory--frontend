import { RatePlan } from "./RatePlan";

export interface Room {
  roomId: number;              // maps to roomId
  roomName: string;          // maps to roomName
  description: string;       // maps to description
  roomType: string;          // maps to roomType
  roomView: string;          // maps to roomView
  roomSize: number;          // maps to roomSize — should be number
  sizeUnit: 'SQFT' | 'SQM';  // maps to sizeUnit — must match backend enum exactly
  numberOfRooms: number;     // maps to numberOfRooms
  hotelId: number;    
  
    active?: boolean;
     isExpanded?: boolean; 
     ratePlans?: RatePlan[] ;      // maps to hotelId
}
