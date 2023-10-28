const AWS = require("@aws-sdk/client-ssm");
const { CONFIG } = require("../../config/config");

const client = new AWS.SSM({
  region: CONFIG.REGION,
  credentials: {
    accessKeyId: CONFIG.ACCESS_KEY,
    secretAccessKey: CONFIG.SECRET_KEY,
  },
});

class SSMService {
  async getParameters(parameters) {
    const params = {
      Names: parameters,
      WithDecryption: true,
    };

    const retrievedParameters = await this.client.getParameters(params);

    return retrievedParameters.Parameters;
  }

  constructor() {
    this.client = client;
  }
}

module.exports = SSMService;
