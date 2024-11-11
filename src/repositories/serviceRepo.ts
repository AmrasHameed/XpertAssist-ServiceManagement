import { ObjectId } from 'mongodb';
import Service from '../entities/service';
import jobModel from '../entities/job';
import {
  JobInterface,
  RegisterService,
  ServiceInterface,
} from '../utilities/interface';
import { Document, PipelineStage } from 'mongoose';

export default class ServiceRepository {
  findByName = async (name: string): Promise<ServiceInterface | null> => {
    try {
      const service = await Service.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
      });
      return service;
    } catch (error) {
      console.error('Error finding service by name:', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findById = async (id: string) => {
    try {
      const service = await Service.findById(id).select(
        '_id name description price serviceImage'
      );
      return service;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  find = async () => {
    try {
      const services = await Service.find().select(
        '_id name description price serviceImage'
      );
      return services;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  saveService = async (
    serviceData: RegisterService
  ): Promise<{ message: string }> => {
    const newService = new Service({
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price,
      serviceImage: serviceData.serviceImage,
    });

    try {
      await newService.save();
      console.log('Service saved into the database.');
      return { message: 'ServiceCreated' };
    } catch (error) {
      console.error('Error saving service:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  findByIdAndUpdate = async (
    id: string,
    serviceData: RegisterService
  ): Promise<{ message: string }> => {
    try {
      const updateData: Partial<RegisterService> = {
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
      };
      if (serviceData.serviceImage) {
        updateData.serviceImage = serviceData.serviceImage;
      }
      const updatedService = await Service.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedService) {
        console.log('Service not found.');
        return { message: 'Service not found.' };
      }
      console.log('Service updated successfully.');
      return { message: 'ServiceUpdated' };
    } catch (error) {
      console.error('Error updating service:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  deleteById = async (id: string): Promise<{ message: string }> => {
    try {
      const deletedService = await Service.findByIdAndDelete(id);

      if (!deletedService) {
        console.log('Service not found.');
        return { message: 'Service not found.' };
      }

      console.log('Service deleted successfully.');
      return { message: 'success' };
    } catch (error) {
      console.error('Error deleting service:', (error as Error).message);
      return { message: (error as Error).message };
    }
  };

  createJob = async (
    expertId: string,
    userLocation: { lat: number; lng: number },
    expertLocation: { latitude: number; longitude: number },
    service: string,
    notes: string,
    distance: number,
    userId: string,
    totalAmount: number,
    ratePerHour: number,
    pin: number
  ): Promise<string> => {
    try {
      const jobData = {
        expertId,
        userLocation,
        expertLocation,
        service,
        notes,
        distance,
        userId,
        totalAmount,
        ratePerHour,
        pin,
      };
      const job = await jobModel.create(jobData);
      return job._id.toString();
    } catch (error) {
      throw new Error('Error creating job');
    }
  };

  findJobById = async (id: string) => {
    try {
      const jobData = await jobModel.findById(id);
      return jobData;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  changeStatus = async (id: string) => {
    try {
      const jobData = await jobModel.findByIdAndUpdate(
        id,
        { status: 'started' },
        { new: true }
      );
      return jobData?.status;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findByIdAndUpdateJob = async (
    id: string,
    amount: number,
    paymentType: string
  ) => {
    try {
      const jobData = await jobModel.findByIdAndUpdate(
        id,
        {
          status: 'completed',
          totalAmount: amount,
          payment: 'success',
          paymentType,
        },
        { new: true }
      );
      return jobData?.payment;
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findExpertDashboardData = async (id: string) => {
    try {
      const currentDate = new Date();
      const startOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const startOfNextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      const startOfPreviousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );

      const aggregationPipeline: PipelineStage[] = [
        {
          $facet: {
            allTimeData: [
              { $match: { expertId: id } },
              {
                $group: {
                  _id: null,
                  totalEarnings: {
                    $sum: {
                      $cond: [
                        { $eq: ['$status', 'completed'] },
                        { $multiply: ['$totalAmount', 0.9] }, // Apply 10% reduction
                        0
                      ]
                    }
                  },
                  totalJobs: { $sum: 1 },
                  totalCompletedJobs: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                  totalDistance: { $sum: '$distance' },
                },
              },
            ],
            currentMonthData: [
              { 
                $match: {
                  expertId: id,
                  createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
                },
              },
              {
                $group: {
                  _id: null,
                  totalEarnings: {
                    $sum: {
                      $cond: [
                        { $eq: ['$status', 'completed'] },
                        { $multiply: ['$totalAmount', 0.9] }, // Apply 10% reduction
                        0
                      ]
                    }
                  },
                  totalJobs: { $sum: 1 },
                  totalCompletedJobs: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                  totalDistance: { $sum: '$distance' },
                },
              },
            ],
            previousMonthData: [
              { 
                $match: {
                  expertId: id,
                  createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth },
                },
              },
              {
                $group: {
                  _id: null,
                  totalEarnings: {
                    $sum: {
                      $cond: [
                        { $eq: ['$status', 'completed'] },
                        { $multiply: ['$totalAmount', 0.9] }, // Apply 10% reduction
                        0
                      ]
                    }
                  },
                  totalJobs: { $sum: 1 },
                  totalCompletedJobs: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                  totalDistance: { $sum: '$distance' },
                },
              },
            ],
            dailyEarningsCurrentMonth: [
              { 
                $match: {
                  expertId: id,
                  createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth },
                },
              },
              {
                $group: {
                  _id: { $dayOfMonth: '$createdAt' },
                  dailyEarnings: {
                    $sum: {
                      $cond: [
                        { $eq: ['$status', 'completed'] },
                        { $multiply: ['$totalAmount', 0.9] }, // Apply 10% reduction
                        0
                      ]
                    }
                  },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  date: { $toString: '$_id' },
                  dailyEarnings: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            allTimeData: { $arrayElemAt: ['$allTimeData', 0] },
            currentMonthData: { $arrayElemAt: ['$currentMonthData', 0] },
            previousMonthData: { $arrayElemAt: ['$previousMonthData', 0] },
            dailyEarningsCurrentMonth: 1,
          },
        },
        {
          $project: {
            totalEarnings: '$allTimeData.totalEarnings',
            totalJobs: '$allTimeData.totalJobs',
            totalCompletedJobs: '$allTimeData.totalCompletedJobs',
            totalDistance: '$allTimeData.totalDistance',
      
            totalEarningsCurrentMonth: '$currentMonthData.totalEarnings',
            totalJobsCurrentMonth: '$currentMonthData.totalJobs',
            totalCompletedJobsCurrentMonth: '$currentMonthData.totalCompletedJobs',
            totalDistanceCurrentMonth: '$currentMonthData.totalDistance',
      
            totalEarningsPreviousMonth: '$previousMonthData.totalEarnings',
            totalJobsPreviousMonth: '$previousMonthData.totalJobs',
            totalCompletedJobsPreviousMonth: '$previousMonthData.totalCompletedJobs',
            totalDistancePreviousMonth: '$previousMonthData.totalDistance',
      
            dailyEarningsCurrentMonth: 1,
          },
        },
        {
          $project: {
            totalEarningsGrowth: {
              $cond: [
                { $eq: ['$totalEarningsPreviousMonth', 0] },
                0,
                {
                  $multiply: [
                    { $divide: [{ $subtract: ['$totalEarningsCurrentMonth', '$totalEarningsPreviousMonth'] }, '$totalEarningsPreviousMonth'] },
                    100,
                  ],
                },
              ],
            },
            totalJobsGrowth: {
              $cond: [
                { $eq: ['$totalJobsPreviousMonth', 0] },
                0,
                {
                  $multiply: [
                    { $divide: [{ $subtract: ['$totalJobsCurrentMonth', '$totalJobsPreviousMonth'] }, '$totalJobsPreviousMonth'] },
                    100,
                  ],
                },
              ],
            },
            totalCompletedJobsGrowth: {
              $cond: [
                { $eq: ['$totalCompletedJobsPreviousMonth', 0] },
                0,
                {
                  $multiply: [
                    { $divide: [{ $subtract: ['$totalCompletedJobsCurrentMonth', '$totalCompletedJobsPreviousMonth'] }, '$totalCompletedJobsPreviousMonth'] },
                    100,
                  ],
                },
              ],
            },
            totalDistanceGrowth: {
              $cond: [
                { $eq: ['$totalDistancePreviousMonth', 0] },
                0,
                {
                  $multiply: [
                    { $divide: [{ $subtract: ['$totalDistanceCurrentMonth', '$totalDistancePreviousMonth'] }, '$totalDistancePreviousMonth'] },
                    100,
                  ],
                },
              ],
            },
      
            totalEarnings: 1,
            totalJobs: 1,
            totalCompletedJobs: 1,
            totalDistance: 1,
            dailyEarningsCurrentMonth: 1,
          },
        },
      ];
      const result = await jobModel.aggregate(aggregationPipeline);
      if (result.length > 0) {
        return result[0];
      } else {
        return { message: 'No services found for this expert.' };
      }
    } catch (error) {
      console.error('Error finding service: ', (error as Error).message);
      throw new Error('Service search failed');
    }
  };

  findJobByExpertId = async(id: string) => {
    try {
      const jobs = await jobModel.find({ expertId: id }).sort({ createdAt: -1 });
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs by expertId:", error);
      throw new Error("Could not fetch jobs for the given expertId.");
    }
  }

  getServiceData  = async () => {
    try {
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      const totalServices = await Service.countDocuments();
  
      const servicesThisMonth = await Service.countDocuments({
        createdAt: { $gte: firstDayOfCurrentMonth },
      });
      const servicesLastMonth = await Service.countDocuments({
        createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
      });
      const serviceGrowthRate = servicesLastMonth
        ? ((servicesThisMonth - servicesLastMonth) / servicesLastMonth) * 100
        : 0;

      const totalJobsCompleted = await jobModel.countDocuments({ status: 'completed' });
  
      const jobsCompletedThisMonth = await jobModel.countDocuments({
        status: 'completed',
        completedAt: { $gte: firstDayOfCurrentMonth },
      });

      const jobsCompletedLastMonth = await jobModel.countDocuments({
        status: 'completed',
        completedAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
      });
  
      const jobCompletionGrowthRate = jobsCompletedLastMonth
        ? ((jobsCompletedThisMonth - jobsCompletedLastMonth) / jobsCompletedLastMonth) * 100
        : 0;
  
      const top5BookedServices = await jobModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$service', bookingCount: { $sum: 1 } } },
        { $sort: { bookingCount: -1 } },
        { $limit: 5 },
        { $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        },
        { $unwind: '$serviceDetails' },
        { $project: { serviceId: '$_id', bookingCount: 1, name: '$serviceDetails.name',_id: 0 } },
      ]);
  
      return {
        totalServices,
        serviceGrowthRate,
        totalJobsCompleted,
        jobCompletionGrowthRate,
        top5BookedServices,
      };
    } catch (error) {
      console.error('Error fetching service data:', (error as Error).message);
      throw new Error('Service data fetch failed');
    }
  };


  findJobByUserId = async(id: string) => {
    try {
      const jobs = await jobModel.find({ userId: id }).sort({ createdAt: -1 });
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs by expertId:", error);
      throw new Error("Could not fetch jobs for the given expertId.");
    }
  }

  findJob = async() => {
    try {
      const jobs = await jobModel.find().sort({ createdAt: -1 });
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs by expertId:", error);
      throw new Error("Could not fetch jobs for the given expertId.");
    }
  }
}
