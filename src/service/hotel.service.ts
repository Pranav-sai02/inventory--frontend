import axios from 'axios';
import { Hotel } from '../type/Hotel';

const BASE_URL = 'http://localhost:8081/api/hotels';

export const saveHotel = async (hotel: Hotel) => {
  return axios.post(`${BASE_URL}/save`, hotel);
};

export const fetchAllHotels = async (): Promise<Hotel[]> => {
  const response = await axios.get(`${BASE_URL}/hotels`);
  return response.data;
};
// http://localhost:8081/api/hotels/hotels



// http://localhost:8081/api/hotels