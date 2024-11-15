import { toJSON } from "@reis/mongoose-to-json";
import { Schema, model } from "mongoose";

const locationSchema = new Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    stockLevel: { type: Number, default: 0 }
}, { timestamps: true });



// Create a 2d sphere index on the location field for geo-spatial queries
locationSchema.index({ location: '2dsphere' });

locationSchema.plugin(toJSON);

export const LocationModel = model('Location', locationSchema);