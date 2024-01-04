const jwt = require('jsonwebtoken');
const config = require('../../config');
const CryptoJS = require("crypto-js");
const commonVariable = require('../../libs/static/common');
const userModel = require('../../models/user-model.js');

module.exports.checkAuth = async function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            error: 'Protected resource, use Authorization header to get access.'
        });
    }

    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const verifyJwtStatus = jwt.verify(token, config.JWT_SALT); // JWT verify

        if (!verifyJwtStatus) {
            return res.status(401).send({
                message: 'Protected resource, use Authorization header to get access.',
            });
        }
        
        const sessionId = verifyJwtStatus.sessionId;
        let userId = CryptoJS.AES.decrypt(verifyJwtStatus.user, config.SECRET_KEY); // Decrypt user ID
        userId = userId.toString(CryptoJS.enc.Utf8);

        let loginUserDetail = await userModel.getLoginSessionUserDetail(userId, sessionId);

        if(loginUserDetail && loginUserDetail.length > 0) {
            req.userId = userId;
            req.sessionId = verifyJwtStatus.sessionId;
            next();
        } else {
            return res.status(401).send({
                message: 'Protected resource, use Authorization header to get access.',
            });
        }

        /*sesstion.findOne({
            sessionId: verifyJwtStatus.sessionId,
            status: commonVariable.status.ACTIVE
        }).exec(function (err, sessionInfo) {
            if (sessionInfo) {
                req.userId = sessionInfo.employeeId;
                req.sessionId = verifyJwtStatus.sessionId;
                next();
            } else {
                return res.status(401).send({
                    message: 'Protected resource, use Authorization header to get access.',
                });
            }
        });*/
    } catch (err) {
        return res.status(401).send({
            message: ' Authorization token verification failed!.',
        });

    }
}

module.exports.checkUnAuth = async function (req, res, next) {
    try {
        next();
    } catch (err) {
    }
}
