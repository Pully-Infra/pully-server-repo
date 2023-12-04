const { ERROR_MESSAGES } = require("../../helpers/constants");
const TokenUtils = require("../../helpers/tokenUtils");

const authorizeConnection = async (io, next) => {
  const token = io.handshake.auth.token;
  const appName = io.handshake.auth.appId;

  io.appName = appName;

  try {
    const validToken = await TokenUtils.verifyToken(token);

    if (validToken?.secret) {
      next();
    } else {
      next(new Error(ERROR_MESSAGES.UNAUTHENTICATED));
    }
  } catch (err) {
    console.log(err);
    next(new Error(ERROR_MESSAGES.UNAUTHENTICATED));
  }
};

module.exports = {
  authorizeConnection,
};
