const ROLES = require("../utils/constants/roles");
const { ForbiddenRequestError } = require("../utils/errors");

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN)
    throw ForbiddenRequestError("Only Admin are authorized for this action!");
  next();
};

module.exports = authorizeAdmin;
