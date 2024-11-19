import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


const orderSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'User' },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
    stockLevel: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    downPayment: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
}, {
    timestamps: true,
});

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref:'Product', required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, default: 0 },
},{
    timestamps: true
})

orderSchema.plugin(toJSON);

cartSchema.plugin(toJSON);

export const OrderModel = model('Order', orderSchema);
export const CartModel = model('Cart', cartSchema);