import mongoose, { Schema } from 'mongoose';
import { JobInterface } from '../utilities/interface';

const JobSchema: Schema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    expertId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    expertLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    notes: {
      type: String,
      default: '',
    },
    distance: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    ratePerHour: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    pin: {
      type: Number,
      required: true,
    },
    payment: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending',
    },
    paymentType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const jobModel = mongoose.model<JobInterface>('Job', JobSchema);

export default jobModel;
