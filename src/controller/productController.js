import { ProductModel } from "../models/productModel.js";
import { addProductValidator } from "../validators/productValidator.js";


// Search  Products
export const searchProducts = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };

        const products = await ProductModel.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
}
// Add a new product
export const addProduct = async (req, res, next) => {
    try {
        // Input validation
        const { error, value } = addProductValidator.validate({
            ...req.body,
            image: req.file?.filename || null
        });

        if (error) {
            return res.status(422).json({
                status: 'error',
                message: 'Invalid product data',
                details: error.details.map(detail => detail.message)
            });
        }

        // Create product with seller ID from authenticated user
        const newProduct = await ProductModel.create({
            ...value,
            seller: req.auth.id,
            createdAt: new Date(),
            status: 'active'
        });

        // Successful response
        res.status(201).json({
            message: 'Product added successfully',
            description: newProduct
        });
    } catch (error) {
        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        // Pass to global error handler
        next(error);
    }
};

// Get all products
export const getAllProducts = async(req, res, next) => {
    try {
        const products = await ProductModel.find().populate('seller', 'name');
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

// Get a specific product by ID
export const getProductById = async(req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id).populate('seller', 'name');
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } 
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}