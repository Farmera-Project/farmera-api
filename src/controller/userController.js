import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, BlacklistModel } from "../models/userModel.js";
import { registerUserValidator, loginUserValidator, updateUserValidator } from "../validators/userValidator.js";
import { sendEmail } from "../services/emailService.js";


export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        // Check if User already exists
        const existingUser = await UserModel.findOne({ email:value.email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });    
        }

        // Hash Password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        const newUser = await UserModel.create({ 
            ...value,
            password: hashedPassword
        })

        // Send Welcome Email
        await sendEmail(newUser.email);

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }

        // Find one with identifier
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid Credentials!');
        }

        // Sign a token for user
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        const response = {
            user,token
        }

        // Respond to request
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}


// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id).select({ password: false });
        res.json(user);
    } catch (error) {
        next(error);
    }
}

// Update user profile
export const updateProfile = async (req, res, next) => {
    try {
        const { error, value } = updateUserValidator.validate({
            ...req.body,
            image: req.file?.filename
        })
        if (error) {
            return res.status(422).json(error);
        }
        await UserModel.findByIdAndUpdate(req.auth.id, value);
        res.json({ message: 'User profile updated successfully' });
    } catch (error) {
        next(error);
    }
}


// Logout user
export const userLogout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        // Decode the token to get the expiry time
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        await BlacklistModel.create({ token, expiresAt });

        res.json({ message: 'User logged out successfully' });

        
    } catch (error) {
        next(error);
    }
} 