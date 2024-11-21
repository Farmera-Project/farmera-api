import express from "express";
import { addProduct, getAllProducts, getProductById, searchProducts } from "../controller/productController.js";
import { isAuthenticated, hasPermission} from "../middlewares/authMiddleware.js";
import { productImageUpload } from "../middlewares/upload.js";

const productRouter = express.Router();

// Route to add a new product
productRouter.post('/products', isAuthenticated, hasPermission('add_products'), productImageUpload.single('image'), addProduct);

productRouter.get('/products',isAuthenticated, hasPermission('get_all_products'), getAllProducts);

productRouter.get('/products/search', searchProducts, getAllProducts);

productRouter.get('/products/:id', isAuthenticated, hasPermission('get_product'), getProductById);

export default productRouter;