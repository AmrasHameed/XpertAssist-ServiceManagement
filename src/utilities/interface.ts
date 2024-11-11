import { Document, ObjectId } from 'mongoose';

export interface ServiceInterface extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  serviceImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobInterface extends Document {
  _id: ObjectId;
  service: string;
  expertId: string;
  userId: string;
  userLocation: {
    lat: number;
    lng: number;
  };
  expertLocation: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  distance: number;
  totalAmount: number;
  ratePerHour: number;
  status: string;
  pin: number;
  payment: 'success' | 'pending' | 'failed';
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterService {
  name: string;
  description: string;
  price: number;
  serviceImage: string;
}
