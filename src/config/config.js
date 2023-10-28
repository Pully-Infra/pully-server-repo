const CONFIG = {
  REGION: process.env.REGION,
  ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID_ENV,
  SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY_ENV,
  BUCKET_NAME: process.env.AWS_BUCKET_NAME || "pully-general-bucket",
};
const GENERAL_CONFIG = {
  region: CONFIG.REGION,
  credentials: {
    accessKeyId: CONFIG.ACCESS_KEY,
    secretAccessKey: CONFIG.SECRET_KEY,
  },
};

module.exports = {
  CONFIG,
  GENERAL_CONFIG,
};
