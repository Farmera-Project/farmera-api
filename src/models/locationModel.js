import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const locationSchema = new Schema({
  name: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  stockLevel: { type: Number, default: 0 }
}, { timestamps: true });

locationSchema.index({ location: '2dsphere' });
locationSchema.plugin(toJSON);

export const LocationModel = model('Location', locationSchema);
