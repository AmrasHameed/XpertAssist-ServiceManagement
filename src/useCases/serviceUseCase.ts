import ServiceRepository from '../repositories/serviceRepo';
import { ServiceInterface } from '../utilities/interface';

const serviceRepository = new ServiceRepository();

export default class ServiceUseCase {
  getServices = async () => {
    try {
      const services = await serviceRepository.find();
      if (services && services.length > 0) {
        return { services };
      } else {
        return { message: 'NoServicesFound' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getService = async (id: string) => {
    try {
      const service = await serviceRepository.findById(id);
      if (service) {
        return { service };
      } else {
        return { message: 'NoServicesFound' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  addService = async (
    name: string,
    description: string,
    price: number,
    serviceImage: string
  ) => {
    try {
      const service = (await serviceRepository.findByName(
        name
      )) as ServiceInterface;
      if (service) {
        return { message: 'ServiceExist' };
      }
      const newServiceData = {
        name,
        description,
        price,
        serviceImage,
      };
      const response = await serviceRepository.saveService(newServiceData);
      if (response.message === 'ServiceCreated') {
        return { message: 'success' };
      } else {
        return { message: 'ServiceNotCreated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updateService = async (
    id: string,
    name: string,
    description: string,
    price: number,
    serviceImage: string
  ) => {
    try {
      const service = (await serviceRepository.findById(
        id
      )) as ServiceInterface;
      if (service) {
        const newServiceData = {
          name,
          description,
          price,
          serviceImage,
        };
        const response = await serviceRepository.findByIdAndUpdate(
          id,
          newServiceData
        );
        if (response.message === 'ServiceUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'Service Not Updated' };
        }
      }
      return { message: 'Service do not Exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  deleteService = async (id: string) => {
    try {
      const { message } = await serviceRepository.deleteById(id);
      if (message === 'success') {
        return { message };
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  createService = async (
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
  ) => {
    try {
      const jobId = await serviceRepository.createJob(
      expertId,
      userLocation,
      expertLocation,
      service,
      notes,
      distance,
      userId,
      totalAmount,
      ratePerHour,
      pin
    );
    return {id: jobId}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getJobData = async (id: string) => {
    try {
      const service = await serviceRepository.findJobById(id);
      if (service) {
        return service;
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  startJob = async (id: string) => {
    try {
      const service = await serviceRepository.changeStatus(id);
      if (service === 'started') {
        return { message: 'success' };
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  paymentSuccess = async (id: string, amount: number,
    paymentType: string) => {
    try {
      const service = await serviceRepository.findByIdAndUpdateJob(id, amount, paymentType);
      if (service === 'success') {
        return { message: 'success' };
      } else {
        return { message: 'Error updating Job' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getExpertDashboard = async (id: string) => {
    try {
      const service = await serviceRepository.findExpertDashboardData(id);
      if (service) {
        return service;
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getPreviousJobs = async (id: string) => {
    try {
      const service = await serviceRepository.findJobByExpertId(id);
      if (service) {
        return service;
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getServiceData = async () => {
    try {
      const serviceData = await serviceRepository.getServiceData();
      if (serviceData) {
        return serviceData;
      } else {
        return { message: 'NoServicesFound' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  getPreviousJobsUser = async (id: string) => {
    try {
      const service = await serviceRepository.findJobByUserId(id);
      if (service) {
        return service;
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
 
  getJobs = async () => {
    try {
      const service = await serviceRepository.findJob();
      if (service) {
        return service;
      } else {
        return { message: 'No Services Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}
