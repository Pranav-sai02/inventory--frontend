// src/api/roomApi.ts

import { Room } from '../type/room';
import axiosInstance from './axiosInstance';

// Get rooms by hotel ID
export const fetchRoomsByHotel = async (hotelId: number): Promise<Room[]> => {
  const response = await axiosInstance.get(`/rooms/hotel/${hotelId}`);
  return response.data;
};

// Get a single room by ID
export const fetchRoomById = async (id: number): Promise<Room> => {
  const response = await axiosInstance.get(`/rooms/${id}`);
  return response.data;
};

// Create a new room
export const createRoom = async (room: Omit<Room, 'id'>): Promise<void> => {
  await axiosInstance.post('/rooms/save', room);
};

// Update a room by ID
export const updateRoom = async (room: Room): Promise<Room> => {
  const response = await axiosInstance.put(`/rooms/${room.id}`, room);
  return response.data;
};

// Delete a room by ID
export const deleteRoom = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/rooms/${id}`);
};
