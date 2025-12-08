import Joi from "joi";

const loginUserDto = {
    phone_number: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
        'string.base': 'Phone number must be a text string'
    }),
    password: Joi.string().required().min(8).messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
        'string.base': 'Password must be a text string',
        'string.min': 'Password must be at least 8 characters'
    }),
}

const loginUserSchema = Joi.object(loginUserDto);
export default loginUserSchema;