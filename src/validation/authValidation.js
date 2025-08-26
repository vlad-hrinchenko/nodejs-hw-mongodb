
import Joi from 'joi';

export const registerUserValidation = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
