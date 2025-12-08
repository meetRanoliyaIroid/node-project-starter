import Joi from "joi";

const changePasswordDto = {
    old_password: Joi.string().required().messages({
        'string.empty': 'Old password is required',
        'any.required': 'Old password is required',
        'string.base': 'Old password must be a text string'
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

const changePasswordSchema = Joi.object(changePasswordDto);

export default changePasswordSchema;