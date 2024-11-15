import { ProductModel } from "../models/productModel.js";

// Add a new product
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        if (!req.auth || !req.auth.id) { // Check req.auth instead of req.user
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const newProduct = new ProductModel({
            name,
            description,
            price,
            stock,
            image: imageUrl,
            seller: req.auth.id // Use req.auth.id for seller ID
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct, imageUrl });
    } catch (error) {
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