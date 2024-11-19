import { CartModel, OrderModel } from "../models/orderModel.js";
import { ProductModel } from "../models/productModel.js";


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

// Add to cart
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.auth._id;

        // Fetching product details to calculate price
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const price = product.price * quantity;

        // Create a new cart item
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity and price of existing item
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price += price;
            } else {
                // Add new item to cart
                cart.items.push({ productId, quantity, price });
            }
            // Update total price
            cart.totalAmount += price;
        } else {
            // Create a new cart for the user
            cart = new CartModel({ 
                userId, 
                items: [{ productId, quantity, price }], totalAmount: price });
        }

        await cart.save();
        return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// Remove from cart
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.auth.id;

        // Find the user's cart
        const cart = await CartModel.findOne({ userId });
        if (!cart){
            return res.status(404).json({ message: 'Cart not found' });
        } 

        // Check if the product exists in the cart
        const itemIndex = cart.itemsfindIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
         cart.totalAmount -= cart.items[itemIndex].price;
         cart.items.splice(itemIndex, 1);

         await cart.save();
         return res.status(200).json({ message: 'Product removed from cart successfully', cart });
        } else{
            return res.status(404).json({ message: 'Product not found in cart' });
        }

    } catch (error) {
        console.error(error);
        next(error);
        
    }
};

export const getCart = async (req, res, next) => {
    try {
        const userId = req.auth._id;

        const cart = await CartModel.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        next(error);
    }
}