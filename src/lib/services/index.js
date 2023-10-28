const S3Service = require("./s3");
const SSMService = require("./ssm");
const LambdaService = require("./lambda");

const uploader = new S3Service();
const secretStore = new SSMService();
const lambdaService = new LambdaService();

module.exports = {
  uploader,
  secretStore,
  lambdaService,
};
