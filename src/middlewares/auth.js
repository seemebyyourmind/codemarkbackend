getAuthInfoFromGateway = (req, res, next) => {
    let infoHeader = req.headers["x-authen-info"];

    if (!infoHeader) {
        res.status(404).send({
            message: "Unauthorized"
        });
        return;
    }

    let info = JSON.parse(JSON.parse(infoHeader));
    req.userId = info.userId;
    req.authenedRoles = info.authenedRoles;
    next();
};

/**
 * Gọi Middleware này bên sau Middleware getAuthInfoFromGateway
 */
isAdmin = (req, res, next) => {
    let authenedRoles = req.authenedRoles;
    if (!authenedRoles) {
        res.status(404).send({
            message: "Require Admin"
        });
        return;
    }

    if (authenedRoles.indexOf("admin") === -1) {
        res.status(404).send({
            message: "Require Admin"
        });
        return;
    }

    next();
}


/**
 * Gọi Middleware này bên sau Middleware getAuthInfoFromGateway
 */
isAdminOrMod = (req, res, next) => {
    let authenedRoles = req.authenedRoles;
    if (!authenedRoles) {
        res.status(404).send({
            message: "Require Admin or Mod"
        });
        return;
    }

    if (authenedRoles.indexOf("admin") === -1 && authenedRoles.indexOf("mod") === -1) {
        res.status(404).send({
            message: "Require Admin or Mod"
        });
        return;
    }

    next();
}

const authMiddlewares = {
    getAuthInfoFromGateway : getAuthInfoFromGateway,
    isAdmin : isAdmin,
    isAdminOrMod : isAdminOrMod
};
module.exports = authMiddlewares;
