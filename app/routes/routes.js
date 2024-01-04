/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

module.exports = function(router) {
    const middleware = require('../libs/util/token-validator-middleware');
    const commonController = require('../controllers/common-controller');
    const { loginValidator, registerValidator } = require("../validations");

    router.post("/login", loginValidator, commonController.login);
    router.post("/register", registerValidator, commonController.register);

}