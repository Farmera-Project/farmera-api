import { ProductModel } from "../models/productModel.js";

// Add a new product
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;

        // Debugging file upload
        console.log("Uploaded file details:", req.file);

        // Get image URL or debug upload failure
        const imageUrl = req.file?.url;
        if (!imageUrl) {
            return res.status(500).json({ error: "Image upload failed." });
        }

        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ error: "User not authenticated." });
        }

        // Create and save the new product
        const newProduct = new ProductModel({
            name,
            description,
            price,
            stock,
            image: imageUrl, // Use SaveFilesOrg URL
            seller: req.auth.id,
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error in addProduct:", error); // Debugging
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