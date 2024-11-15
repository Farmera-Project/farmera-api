import { OrderModel } from "../models/orderModel.js";


// Place an order
export const placeOrder = async (req, res, next) => {
    try {
        const { farmerId, locationId, stockLevel, totalAmount, downPayment, deliveryAddress } = req.body;

        const remainingAmount = totalAmount - downPayment;

        const newOrder = new OrderModel({
            farmerId,
            locationId,
            stockLevel,
            totalAmount,
            downPayment,
            remainingAmount,
            deliveryAddress
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

// Get all orders for a specific farmer
export const getOrdersByFarmer = async (req, res, next) => {
    try {
        const orders = await OrderModel.find({ farmerId: req.params.farmerId }).populate('locationId');
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;  // Get the order id from the URL parameters
        const { status } = req.body;  // Get the new status from the request body

        // Validate the status (if needed)
        const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find and update the order status
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);  // Return the updated order
    } catch (error) {
        next(error);  // Handle errors (e.g., database issues)
    }
};

