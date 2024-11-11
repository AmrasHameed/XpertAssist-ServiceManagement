import mongoose, { Schema } from 'mongoose';
import { ServiceInterface } from '../utilities/interface';

const ServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    serviceImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const serviceModel = mongoose.model<ServiceInterface>('Service', ServiceSchema);

export default serviceModel;