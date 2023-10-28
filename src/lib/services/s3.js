const stream = require("stream");
const AWS = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const TextUtils = require("../../helpers/textUtils");
const { CONFIG, GENERAL_CONFIG } = require("../../config/config");

const client = new AWS.S3Client(GENERAL_CONFIG);

const bucketNameString = CONFIG.BUCKET_NAME;

class S3Service {
  async uploadService(
    { body, fileName, contentType, createReadStream },
    appendIdentifier = true
  ) {
    const pass = new stream.PassThrough();

    if (createReadStream) {
      const uploadStream = createReadStream();
      uploadStream.pipe(pass);
    }

    const properties = {
      contentType,
      body: createReadStream ? pass : body,
      key: appendIdentifier
        ? TextUtils.appendUniqieIdentifier(fileName)
        : fileName,
    };

    const initiateUpload = new Upload({
      client: this.client,
      params: this.constructParamsObj(properties),
    });

    const result = await initiateUpload.done();

    return result;
  }

  async upload(data = [], appendIdentifier = true) {
    const results = [];

    for (const file of data) {
      const result = await this.uploadService(file, appendIdentifier);

      results.push({
        url: result.Location,
        fileName: result.Key,
      });
    }

    return results;
  }

  async getFile(properties, type = "base64") {
    const construct = this.constructParamsObj(properties);

    const command = new AWS.GetObjectCommand({
      Key: construct.Key,
      Bucket: construct.Bucket,
    });

    try {
      const response = await this.client.send(command);
      return response.Body?.transformToString(type);
    } catch (err) {
      console.log(`File could not be retrieved because of error: ${err}`);
    }
  }

  constructParamsObj = ({
    key,
    body,
    contentType,
    bucketName = bucketNameString,
  }) => {
    return {
      Key: key,
      Body: body,
      Bucket: bucketName,
      ContentType: contentType,
    };
  };

  constructor() {
    this.client = client;
  }
}

module.exports = S3Service;
