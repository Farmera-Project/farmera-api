import Joi from "joi";

export const addProductValidator = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    stock: Joi.number().required(),
    image: Joi.string()
})