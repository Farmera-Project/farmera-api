import { OrderModel } from '../models/orderModel.js';
import { DeliveryModel } from '../models/deliveryModel.js';
import axios from 'axios';

// Helper function to calculate ETA using OSRM API
const calculateETA = async (origin, destination) => {
    const url = `http://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=false`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.routes && data.routes.length > 0) {
            const eta = data.routes[0].duration; // Duration in seconds
            const etaText = convertSecondsToTime(eta); // Convert to human-readable format
            return etaText;
        } else {
            throw new Error('Unable to calculate ETA');
        }
    } catch (error) {
        console.error('Error calculating ETA:', error);
        throw error;
    }
};

// Convert seconds to HH:MM:SS format
const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedTime = `${hours} hours ${minutes} minutes`;
    return formattedTime;
};


// Update Delivery Status
export const updateDeliveryStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { deliveryStatus } = req.body;  // Delivery status from the request body
        
        // Validate delivery status
        if (!['Pending', 'In Transit', 'Delivered', 'Cancelled'].includes(deliveryStatus)) {
            return res.status(400).json({ error: 'Invalid delivery status' });
        }

        // Check if a delivery record exists for the orderId
        let delivery = await DeliveryModel.findOne({ orderId: orderId });

        if (!delivery) {
            // If no delivery record exists, create a new one
            const order = await OrderModel.findById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            delivery = new DeliveryModel({
                orderId: orderId,
                deliveryStatus: 'Pending',  // Set the default status
                estimatedArrivalTime: '', // You can calculate ETA if required
                deliveryDate: null,  // Set the delivery date if available
            });

            await delivery.save();
        }

        // Update the delivery status
        delivery.deliveryStatus = deliveryStatus;

        // Save the updated delivery document
        const updatedDelivery = await delivery.save();

        res.status(200).json(updatedDelivery);  // Respond with the updated delivery details
    } catch (error) {
        next(error);
    }
};


// Get ETA for Delivery
export const getETA = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const sellerLocation = '-0.186964, 5.603717';  // Replace with seller's coordinates in the format "longitude,latitude"
        const deliveryAddress = order.deliveryAddress;  // The address to be delivered to

        // Ensure delivery address is geocoded into coordinates
        const deliveryCoordinates = await geocodeAddress(deliveryAddress); // Geocode address to get latitude and longitude

        if (!deliveryCoordinates) {
            return res.status(400).json({ error: 'Failed to geocode delivery address' });
        }

        // Calculate ETA between seller location and delivery address
        const eta = await calculateETA(sellerLocation, deliveryCoordinates);

        res.status(200).json({ eta });
    } catch (error) {
        console.error('Error in calculating ETA:', error.response?.data || error.message); // Log detailed error
        next(error);
    }
};


// Helper function to geocode an address (use Nominatim Geocoding API)

export const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data.length > 0) {
            const longitude = parseFloat(data[0].lon);
            const latitude = parseFloat(data[0].lat);
            return [longitude, latitude]; // Return as [lon, lat]
        } else {
            throw new Error('Unable to geocode address');
        }
    } catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
    }
};


