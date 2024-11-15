import express from "express";
import { createLocation, findNearbyLocations, getAllLocations, updateLocation, updateStockLevel } from "../controller/locationController.js";


const locationRouter = express.Router();

// Location routes
locationRouter.post('/locations', createLocation);

locationRouter.get('/locations/nearby', findNearbyLocations);

locationRouter.patch('/locations/:id', updateLocation);

locationRouter.get('/locations', getAllLocations);

locationRouter.patch('/locations/:id/stock', updateStockLevel);


export default locationRouter;