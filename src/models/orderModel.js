import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import { type } from "os";

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
})

orderSchema.plugin(toJSON);

export const OrderModel = model('Order', orderSchema);