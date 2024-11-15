import { OrderModel } from "../models/orderModel.js";

// Sales Analytics for a seller
export const getSalesAnalytics = async (req, res) => {
    try {
        const sellerId = req.auth.id; // Assuming the seller's ID is stored in req.auth.id

        // Aggregate total sales and quantity sold for each product
        const totalSales = await OrderModel.aggregate([
            { $match: { 'product.seller': sellerId } }, // Filter by seller
            {
                $group: {
                    _id: '$product',  // Group by product
                    totalRevenue: { $sum: '$totalAmount' },  // Sum of total price (revenue)
                    totalQuantitySold: { $sum: '$stockLevel' },  // Sum of quantities sold
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' }, // Unwind the product information
            {
                $project: {
                    productName: '$productInfo.name',
                    totalRevenue: 1,
                    totalQuantitySold: 1,
                }
            }
        ]);

        res.status(200).json({
            message: 'Sales Analytics retrieved successfully',
            data: totalSales,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Demand Analytics (Aggregating orders by location)
export const getLocationDemandAnalytics = async (req, res) => {
    try {
        // Aggregate orders by location to find total revenue and quantity sold per region
        const locationDemand = await OrderModel.aggregate([
            {
                $group: {
                    _id: '$locationId',  // Group by locationId
                    totalRevenue: { $sum: '$totalAmount' },  // Sum of total amount (revenue)
                    totalQuantitySold: { $sum: '$stockLevel' },  // Sum of quantities sold
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'locationInfo'
                }
            },
            { $unwind: '$locationInfo' }, // Unwind the location information
            {
                $project: {
                    locationName: '$locationInfo.name',
                    totalRevenue: 1,
                    totalQuantitySold: 1,
                }
            },
            { $sort: { totalRevenue: -1 } } // Sort by total revenue (descending)
        ]);

        res.status(200).json({
            message: 'Location Demand Analytics retrieved successfully',
            locationDemand,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
