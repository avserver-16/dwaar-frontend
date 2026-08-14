export interface User {
  _id: string;
  username: string;
  phone: string;
  avatar?: string;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  name: string;
  building: string;
  floor?: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  groupId?: string;
  roomId?: string;
  toUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface NearbyItem {
  _id: string;
  name: string;
  type: 'group' | 'room' | 'building';
  distance?: number;
  description?: string;
  category?: string;
  members?: string[];
  location?: Location;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
  email?: string;
}

export interface SignupData {
  name: string;
  phone: string;
  password: string;
  email: string;
}

export interface CheckPhoneResponse {
  exists: boolean;
}

export interface NearbyResponse {
  groups: NearbyItem[];
  rooms: NearbyItem[];
  buildings: NearbyItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

