const Joi = require('joi')
const options = {
    abortEarly: false, // include all error
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
}

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(file => {
    file = path.basename(file, '.js')
    module.exports[`${file}Validator`] = async (req, res, next) => {
        try {
            req.body = await require(path.join(__dirname, file))(Joi).validateAsync(req.body, options)
            return next()
        } catch (error) {
            if (error.isJoi) {
                error.status = 422
                return next(error)
            } else next(error)
        }
    }
})
