import Joi from "joi";

const appVersionDto = {
    version: Joi.string().required().messages({
        'string.empty': 'Version is required',
        'any.required': 'Version is required',
        'string.base': 'Version must be a text string'
    }),
    platform: Joi.number().required().messages({
        'number.empty': 'Platform is required',
        'any.required': 'Platform is required',
        'number.base': 'Platform must be a number'
    }),
}

const appVersionSchema = Joi.object(appVersionDto);

export default appVersionSchema;