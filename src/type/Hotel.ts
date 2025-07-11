import { Room } from "./room";

export interface Hotel {
  hotelId: number ;
  hotelName: string;
  hotelAddress: string;

  rooms?: Room[];
}