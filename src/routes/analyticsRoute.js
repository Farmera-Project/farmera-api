import express from 'express';
import { getLocationDemandAnalytics, getSalesAnalytics } from '../controller/analyticsController.js';
import { hasPermission, isAuthenticated } from '../middlewares/authMiddleware.js';


const analyticsRouter = express.Router();

// Route to get sales analytics for a seller
analyticsRouter.get('/analytics/sales',isAuthenticated, hasPermission('get_sales_analytics'), getSalesAnalytics);

analyticsRouter.get('/analytics/demand',isAuthenticated, hasPermission('get_demand_analytics'), getLocationDemandAnalytics);

export default analyticsRouter;