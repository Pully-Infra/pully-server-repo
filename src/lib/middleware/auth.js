const authorizeConnection = (io, next) => {
  const headers = io.handshake.headers;
  const token = headers.authorization;

  // const validToken = TokenUtils.verifyToken(token as string);

  next();
};

module.exports = {
  authorizeConnection,
};
