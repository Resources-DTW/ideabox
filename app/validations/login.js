module.exports = Joi => {
    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
}