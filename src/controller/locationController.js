import { type } from "os";
import { LocationModel } from "../models/locationModel.js";


// Create Location for sellers
export const createLocation = async (req, res) => {
    try {
        const { name, location, stockLevel } = req.body;

        const newLocation = new LocationModel({
            name,
            location,
            stockLevel
        });

        await newLocation.save();
        res.status(201).json({ message: 'Location created successfully', newLocation });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating location', error: error.message });
    }
};


// Update location and stock level for an existing seller
export const updateLocation = async (req, res, next) => {
    try {
        const { coordinates, stockLevel } = req.body;
        const location = await LocationModel.findByIdAndUpdate(req.params.id, {
            location: { type: 'Point', coordinates },
            stockLevel
        }, { new: true });
        res.status(200).json(location);
    } catch (error) {
        next(error);
    }
}

// Find nearby sellers based on farmer's location and available stock level
export const findNearbyLocations = async (req, res, next) => {
    try {
        const { longitude, latitude, maxDistance } = req.query;

        // Validate that longitude, latitude are numbers and maxDistance is valid
        if (isNaN(longitude) || isNaN(latitude)) {
            return res.status(400).json({ message: 'Invalid longitude or latitude values' });
        }

        const parsedLongitude = parseFloat(longitude);
        const parsedLatitude = parseFloat(latitude);
        const parsedMaxDistance = parseInt(maxDistance) || 50000; // Default to 50 km if maxDistance is not provided

        // Ensure parsed values are valid
        if (!parsedLongitude || !parsedLatitude) {
            return res.status(400).json({ message: 'Valid longitude and latitude are required' });
        }

        // Query for nearby locations with available stock
        const locations = await LocationModel.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parsedLongitude, parsedLatitude] },
                    $maxDistance: parsedMaxDistance // Max distance in meters
                }
            },
            stockLevel: { $gt: 0 } // Only locations with available stock
        });

        // Return the locations as a response
        if (locations.length === 0) {
            return res.status(404).json({ message: 'No nearby locations found with available stock' });
        }

        res.status(200).json(locations);
    } catch (error) {
        next(error); // Pass the error to the next middleware (usually an error handler)
    }
};


// Get all locations
export const getAllLocations = async (req, res, next) => {
    try {
        const locations = await LocationModel.find();
        res.status(200).json(locations);
    } catch (error) {
        next(error);
    }
}

// Update stock level
export const updateStockLevel = async (req, res, next) => {
    try {
        const { stockLevel } = req.body;

        const location = await LocationModel.findById(req.params.id);
        location.stockLevel = stockLevel;

        // Check for low stock and trigger an alert (optional)
        if (stockLevel < 10) {
            // Send alert or trigger a notification (e.g., Email/SMS)
            console.log('Low stock alert for location:', location.name);
        }

        await location.save();
        res.status(200).json(location);
    } catch (error) {
        next(error);
    }
};