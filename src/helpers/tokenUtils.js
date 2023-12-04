const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

class TokenUtils {
  static createToken = async (payload, expiresIn = 86400) => {
    return jwt.sign(payload, SECRET, {
      expiresIn,
    });
  };

  static verifyToken = async (token) => {
    return jwt.verify(token, SECRET);
  };

  static sendTokenResponse = async (payload, expiresIn) => {
    const token = TokenUtils.createToken(payload, expiresIn);
    return token;
  };
}

module.exports = TokenUtils;
