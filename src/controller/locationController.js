import { LocationModel } from "../models/locationModel.js";
import axios from "axios";

// Geocode an address to get coordinates
async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        limit: 1,
        q: address
      }
    });

    if (response.data && response.data.length > 0) {
      return [
        parseFloat(response.data[0].lon),
        parseFloat(response.data[0].lat)
      ];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Create Location for sellers
export const createLocation = async (req, res) => {
  try {
    const { name, deliveryAddress, location, stockLevel } = req.body;

    const newLocation = new LocationModel({
      name,
      deliveryAddress,
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
    const { deliveryAddress, stockLevel } = req.body;

    // Geocode the delivery address to get coordinates
    const coordinates = await geocodeAddress(deliveryAddress);
    if (!coordinates) {
      return res.status(400).json({ message: 'Failed to geocode the delivery address.' });
    }

    const location = await LocationModel.findByIdAndUpdate(
      req.params.id, 
      { 
        location: { 
          type: 'Point', 
          coordinates 
        }, 
        stockLevel, 
        deliveryAddress 
      }, 
      { new: true }
    );

    res.status(200).json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    next(error);
  }
};

// Find nearby locations with available stock
export const findNearbyLocations = async (req, res, next) => {
  try {
    const { address, maxDistance } = req.query;

    // Geocode the input address
    const coordinates = await geocodeAddress(address);
    if (!coordinates) {
      return res.status(400).json({ message: 'Invalid address' });
    }

    const parsedMaxDistance = parseInt(maxDistance) || 50000; // Default to 50 km

    // Query for nearby locations with available stock
    const locations = await LocationModel.find({
      location: { 
        $near: { 
          $geometry: { 
            type: 'Point', 
            coordinates 
          }, 
          $maxDistance: parsedMaxDistance 
        } 
      },
      stockLevel: { $gt: 0 } // Only locations with available stock
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: 'No nearby locations found with available stock' });
    }

    res.status(200).json(locations);
  } catch (error) {
    next(error);
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