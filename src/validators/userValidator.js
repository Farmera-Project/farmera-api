import Joi from "joi";

export const registerUserValidator = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]\d{0,14}$/)
    .required()
    .messages({
        'string.pattern.base': 'Invalid phone number'
    }),
    businessName: Joi.string().when('role', {
        is: 'wholesaler',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    role: Joi.string().valid('farmer', 'wholesaler', 'retailer').default('farmer'),
    address: Joi.string().required()
});

export const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const updateUserValidator = Joi.object({
    fullName: Joi.string(),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]\d{0,14}$/),
    image: Joi.string()
})