import express from 'express';
import { addToCart, getCart, getOrdersByFarmer, placeOrder, removeFromCart, updateOrderStatus } from '../controller/orderController.js';
import { isAuthenticated, hasPermission } from '../middlewares/authMiddleware.js';


const orderRouter = express.Router();

// Order routes
// Place an order

orderRouter.post('/orders', isAuthenticated, hasPermission('create_order'), placeOrder);

// Get all orders for a specific farmer
orderRouter.get('/orders/farmer/:farmerId', isAuthenticated, hasPermission('get_orders_by_farmer'), getOrdersByFarmer);

// Update order status
orderRouter.patch('/orders/:id',isAuthenticated, hasPermission('update_order_status'), updateOrderStatus);


orderRouter.post('/cart', isAuthenticated, hasPermission('add_to_cart'), addToCart);

orderRouter.get('/cart', isAuthenticated, hasPermission('get_cart'), getCart);

orderRouter.delete('/cart/:productId', isAuthenticated, hasPermission('remove_from_cart'), removeFromCart);

export default orderRouter;
