import { expressjwt } from "express-jwt";
import { UserModel, BlacklistModel } from "../models/userModel.js";
import { permissions } from "../utils/rbac.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if user is authenticated
export const isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth',
})

export const hasPermission = (action) => {
    return async (req, res, next) => {
        try {
            if (!req.auth || !req.auth.id) {
                return res.status(401).json({ error: 'Unauthorized access: User not authenticated.' });
            }

            const user = await UserModel.findById(req.auth.id);
            if (!user) {
                return res.status(404).json('User not found');
            }

            // Use the role to define the permission
            const permission = permissions.find(p => p.role === user.role);

            if (!permission) {
                return res.status(403).json('You do not have permission to perform this action!');
            }

            if (!permission.actions.includes(action)) {
                console.log(`User role ${user.role} does not have permission to perform action ${action}`);
                return res.status(403).json('You do not have permission to perform this action!');
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}


export const checkBlackList = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Check if token is blacklisted
        const blacklistedToken = await BlacklistModel.findOne ({ token });

        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const removeExpiredTokens = async () => {
    await BlacklistModel.deleteMany({ expiresAt: { $lt: new Date() } });
}