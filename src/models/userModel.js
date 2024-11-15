import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    businessName: { type: String },
    role: {
        type: String,
        enum: ['farmer', 'wholesaler', 'retailer'],
        default: 'farmer'
    },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    deliveryAddress: { type: String },
}, {
    timestamps: true,
});


userSchema.plugin(toJSON);

const blacklistSchema = new Schema({});

blacklistSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24
})

export const UserModel = model('User', userSchema);
export const BlacklistModel = model('Blacklist', blacklistSchema);