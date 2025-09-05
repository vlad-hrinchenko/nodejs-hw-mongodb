import Joi from "joi";

export const verifyGoogleOAuthValidationSchema = Joi.object({
    code: Joi.string().required(),
});