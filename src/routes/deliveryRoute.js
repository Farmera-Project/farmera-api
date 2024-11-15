import express from 'express';
import { updateDeliveryStatus, getETA } from '../controller/deliveryController.js';

const deliveryRouter = express.Router();

// Update the delivery status of an order
deliveryRouter.patch('/orders/:orderId/delivery-status', updateDeliveryStatus);

// Get ETA for an order's delivery
deliveryRouter.get('/orders/:orderId/eta', getETA);

export default deliveryRouter;
