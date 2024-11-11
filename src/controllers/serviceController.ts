import ServiceUseCase from '../useCases/serviceUseCase';

const serviceUseCase = new ServiceUseCase();

export default class ServiceController {
  getServices = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const services = await serviceUseCase.getServices();
      callback(null, services);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getService = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const {service} = await serviceUseCase.getService(id);
      callback(null, service);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  addService = async (
    call: {
      request: {
        name: string;
        description: string;
        price: number;
        serviceImage: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const { name, description, price, serviceImage } = call.request;
    try {
      const response = await serviceUseCase.addService(
        name,
        description,
        price,
        serviceImage
      );
      callback(null, response);
    } catch (error) {
      console.error('Login failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  updateService = async (
    call: {
      request: {
        id: string;
        name: string;
        description: string;
        price: number;
        serviceImage: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const {id, name, description, price, serviceImage } = call.request;
    try {
      const response = await serviceUseCase.updateService(
        id,
        name,
        description,
        price,
        serviceImage
      );
      callback(null, response);
    } catch (error) {
      console.error('Login failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  deleteService = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const response = await serviceUseCase.deleteService(id);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  createService = async (
    call: {
      request: {
        expertId: string;
        userLocation: { lat: number; lng: number };
        expertLocation: { latitude: number; longitude: number };
        service: string;
        notes: string;
        distance: number;
        userId: string;
        totalAmount: number;
        ratePerHour: number;
        pin: number;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {
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
      } = call.request;
      const response = await serviceUseCase.createService(expertId,
        userLocation,
        expertLocation,
        service,
        notes,
        distance,
        userId,
        totalAmount,
        ratePerHour,
        pin);
      callback(null, response);
    } catch (error) {
      console.error('Error creating service:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getJobData = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const response = await serviceUseCase.getJobData(id);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  startJob = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const response = await serviceUseCase.startJob(id);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  paymentSuccess = async (
    call: {
      request: {
        id: string;
        amount: number;
        paymentType: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id, amount, paymentType} = call.request
      const response = await serviceUseCase.paymentSuccess(id,amount,paymentType);
      callback(null, response);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getExpertDashboard = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const data = await serviceUseCase.getExpertDashboard(id);
      callback(null, data);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getPreviousJobs  = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const data = await serviceUseCase.getPreviousJobs(id);
      callback(null, {jobs: data});
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getServiceData  = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const serviceData = await serviceUseCase.getServiceData();
      callback(null, serviceData);
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getPreviousJobsUser = async (
    call: {
      request: {
        id: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    try {
      const {id} = call.request
      const data = await serviceUseCase.getPreviousJobsUser(id);
      callback(null, {jobs: data});
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  getJobs = async (
    call: any,
    callback: (error: any, response: any) => void
  ) => {
    try {
      const data = await serviceUseCase.getJobs();
      callback(null, {jobs: data});
    } catch (error) {
      console.error('Error fetching services:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
