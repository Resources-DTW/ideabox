const crypto = require('../../libs/response/crypto');

/**
 * @ERROR__SUCCESS
 * to send response to user's request
 */
exports.errorResponse = function (Success, Message, response) {
    response.status(400).send({
        success: Success,
        message: Message,
    })
}

exports.successResponse = function (Success, Data, response) {
    const encryptedRes = crypto.encrypt(Data);

    response.json({
        success: Success,
        data: Data,
        encryptedResponse: encryptedRes
    })
}