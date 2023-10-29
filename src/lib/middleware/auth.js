const TokenUtils = require("../../helpers/tokenUtils");

const authorizeConnection = (io, next) => {
  const headers = io.handshake.headers;
  const token = headers.authorization;

  const validToken = TokenUtils.verifyToken(token);

  next();
};

module.exports = {
  authorizeConnection,
};
