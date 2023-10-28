const Validator = require("validatorjs");
const { ERROR_MESSAGES, ERROR_CODES, SUCCESS_CODES } = require("./constants");

const responseHandler = ({
  errors,
  data = null,
  message = "",
  status = SUCCESS_CODES.OK,
}) => {
  return {
    data,
    errors,
    status,
    message,
  };
};

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const validationHandler = (errors) => {
  return responseHandler({
    errors: errors || null,
    status: ERROR_CODES.VALIDATION_FAILED,
    message: ERROR_MESSAGES.VALIDATION_FAILED,
  });
};

module.exports = {
  responseHandler,
  validationHandler,
  validator,
};
