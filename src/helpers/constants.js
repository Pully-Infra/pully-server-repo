const ERROR_CODES = {
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  DATABASE_ERROR: 503,
  VALIDATION_FAILED: 400,
  UNIQUE_CONSTRAINT: 409,
};

const SUCCESS_CODES = {
  OK: 200,
  PASSED: 201,
};

const ERROR_MESSAGES = {
  LAMBDA_DEPLOY_FAILED: "Lambda function(s) failed to deploy",
  FAILED_UPLOAD_TO_S3: "Relationship.json could not be saved to S3",
  VALIDATION_FAILED: "Validation failed or Invalid parameter(s) passed",
  UNAUTHENTICATED:
    "You do not have valid authentication to access this resource",
  TOKEN_VALIDATION_FAILED: "Token could not be validated",
  RELATIONSHIP_VALIDATION_FAILED:
    "relationships.json file is improperly formatted or could not be uploaded",
};

const SUCCESS_MESSAGES = {
  LAMBDA_DEPLOYED: "Lambda function(s) deployed successfully",
  RELATIONSHIP_UPDATED: "relationships.json file successfully uploaded",
};

const PULLY_EVENTS = {
  SUBSCRIBE: "subscribe",
  RECEIVE_MESSAGE: "message",
  UNSUBSCRIBE: "unsubscribe",
  SEND_MESSAGE: "send_message",
};

module.exports = {
  ERROR_CODES,
  SUCCESS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PULLY_EVENTS,
};
