module.exports = Joi => {
    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        age: Joi.number().required(),
        email: Joi.string().email().required(),
        mobileNumber: Joi.number().required(),
    });
}