import Joi from "joi";

const registerUserDto = {
    first_name: Joi.string().required().messages({
        'string.empty': 'The first name field is required',
        'any.required': 'The first name field is required',
        'string.base': 'First name must be a text string'
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'The last name field is required',
        'any.required': 'The last name field is required',
        'string.base': 'Last name must be a text string'
    }),
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
    confirm_password: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({
            'any.only': 'Confirm password must match with password',
            'any.required': 'Confirm password is required',
            'string.empty': 'Confirm password is required'
        }),
}

const registerUserSchema = Joi.object(registerUserDto);

export default registerUserSchema;