const responseHandlier = require('../libs/response/status');
const commonVariable = require('../libs/static/common');
const commonFunctions = require('../libs/util/commonFunctions');
const tokenGenerator = require("../libs/util/token-generator");
const userModel = require('../models/user-model.js');
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const { v4: uuidv4 } = require("uuid");

module.exports.register = async (req, res) => {
    try {
        const newUser = new userModel({
            username: req.body.username,
            age: req.body.age,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password
        });

        newUser.save()
            .then((newUser) => {
                responseHandlier.successResponse(true, "Register Successfully", res);
            })
            .catch((error) => {
                responseHandlier.errorResponse(false, error, res);
            });

    } catch (error) {
        console.log(error);
        return responseHandlier.errorResponse(false, error, res);
    }
}

module.exports.login = async (req, res) => {
    try {
        let query = {
            username: req.body.username,
        };
      
        userModel.findOne(query)
            .then(async(userDetail) => {
                if(userDetail) {
                    console.log(userDetail);
                    var validUser = await bcrypt.compare(req.body.password, userDetail.password);
                    if(validUser) {
                        const sessionId = randomstring.generate(20);
                        const token = await tokenGenerator.generateToken(req, userDetail, sessionId);
    
                        let userTokenArr = {
                            sessionToken: token,
                            lastLoginDate: new Date(),
                        }
    
                        const updateUserToken  = await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });
                        if(updateUserToken) {
                            let responseArr = {
                                _id: userDetail._id,
                                userName: userDetail.username,
                                sessionInfo: token
                            }
                            return responseHandlier.successResponse(true, responseArr, res);
                        } else {
                            return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
                        }
                    } else {
                        return responseHandlier.errorResponse(false, "Invalid password", res);
                    }
                } else {
                    return responseHandlier.errorResponse(false, "Invalid username", res);
                }
            })
            .catch((error) => {
                responseHandlier.errorResponse(false, error, res);
            });
    } catch (error) {
        console.log(error);
        return responseHandlier.errorResponse(false, error, res);
    }
}
