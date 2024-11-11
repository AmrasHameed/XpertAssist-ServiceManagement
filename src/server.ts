import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';
import connectDB from './config/mongo';
import ServiceController from './controllers/serviceController';

const serviceController = new ServiceController();

connectDB();

const PROTO_PATH = path.resolve(__dirname, './proto/service.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

if (
  !grpcObject.service ||
  !grpcObject.service.Service ||
  !grpcObject.service.Service.service
) {
  console.error('Failed to load the Service management from the proto file.');
  process.exit(1);
}

const server = new grpc.Server();

server.addService(grpcObject.service.Service.service, {
  AddService: serviceController.addService,
  GetServices: serviceController.getServices,
  GetService: serviceController.getService,
  UpdateService: serviceController.updateService,
  DeleteService: serviceController.deleteService,
  CreateService: serviceController.createService,
  GetJobData: serviceController.getJobData,
  StartJob: serviceController.startJob,
  PaymentSuccess: serviceController.paymentSuccess,
  GetExpertDashboard: serviceController.getExpertDashboard,
  PreviousJobs: serviceController.getPreviousJobs,
  GetServiceData: serviceController.getServiceData,
  PreviousJobsUser: serviceController.getPreviousJobsUser,
  GetJobs: serviceController.getJobs,
});

const SERVER_ADDRESS = process.env.GRPC_SERVER_PORT || '50004';
const Domain =
  process.env.NODE_ENV === 'dev'
    ? process.env.DEV_DOMAIN
    : process.env.PRO_DOMAIN_USER;

server.bindAsync(
  `${Domain}:${SERVER_ADDRESS}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Failed to bind server: ${err}`);
      return;
    }
    console.log(`gRPC server running at ${port}`);
  }
);
