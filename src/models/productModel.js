import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    
});

productSchema.plugin(toJSON);

export const ProductModel = model('Product', productSchema)