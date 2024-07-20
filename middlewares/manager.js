const ROLES = require("../utils/constants/roles");
const { ForbiddenRequestError } = require("../utils/errors");

const authorizeManager = (req, res, next) => {
  if (req.user.role !== ROLES.MANAGER)
    throw ForbiddenRequestError(
      "Only Managers are authorized for this action!"
    );
  next();
};

module.exports = authorizeManager;
