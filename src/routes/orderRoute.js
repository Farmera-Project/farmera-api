import express from 'express';
import { getOrdersByFarmer, placeOrder, updateOrderStatus } from '../controller/orderController.js';


const orderRouter = express.Router();

// Order routes
// Place an order
orderRouter.post('/orders', placeOrder);

// Get all orders for a specific farmer
orderRouter.get('/orders/farmer/:farmerId', getOrdersByFarmer);

// Update order status
orderRouter.patch('/orders/:id', updateOrderStatus);


export default orderRouter;
