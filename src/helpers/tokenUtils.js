const jwt = require("jsonwebtoken");

class TokenUtils {
  static createToken = async (payload, expiresIn = 86400) => {
    return jwt.sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn,
    });
  };

  static verifyToken = async (token) => {
    return jwt.verify(token, `${process.env.JWT_SECRET}`);
  };

  static sendTokenResponse = async (payload, expiresIn) => {
    const token = TokenUtils.createToken(payload, expiresIn);
    return token;
  };
}

module.exports = TokenUtils;
