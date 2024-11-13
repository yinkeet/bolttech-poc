import express from 'express';
import { getCustomers } from './list';
import { getCustomerDevices, getCustomerDevicePolicy } from './details';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:customerId/devices', getCustomerDevices)
router.get('/:customerId/devices/:deviceId/policy', getCustomerDevicePolicy)

export default router;
