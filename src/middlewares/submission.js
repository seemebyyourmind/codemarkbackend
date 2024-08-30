/**
 * Gọi Middleware này bên sau Middleware getAuthInfoFromGateway
 */
checkNullField = (req, res, next) => {
    const requiredFields = [
        'source',
        'problemId',
        'language'
    ];
    const missingFields = [];

    for (let field of requiredFields) {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        res.status(400).json({
            listFields : missingFields,
            message: `Missing required fields`
        });
    } else {
        next();
    }
}

const submmissionMiddleware = {
    checkNullField : checkNullField
};
module.exports = submmissionMiddleware;
