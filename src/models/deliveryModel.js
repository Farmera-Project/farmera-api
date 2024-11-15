import { model, Schema } from "mongoose";

const deliverySchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    deliveryStatus: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    estimatedArrivalTime: {
        type: String, // Store ETA as text (e.g., '2 hours 30 minutes')
    },
    deliveryDate: {
        type: Date,
    },
});

export const DeliveryModel = model('Delivery', deliverySchema);
