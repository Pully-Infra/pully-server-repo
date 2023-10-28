const { Validator: ValidatorJSON } = require("jsonschema");
const { validationHandler, validator } = require("../../helpers/response");

const SCHEMA_NAMES = {
  channels: "/ChannelsSchema",
  functionNames: "/FunctionNamesSchema",
};

const v = new ValidatorJSON();

const channelId = SCHEMA_NAMES.channels;
const functionNamesId = SCHEMA_NAMES.functionNames;

const FunctionNamesSchema = {
  id: functionNamesId,
  type: "array",
  items: {
    type: "string",
  },
};

const ChannelsSchema = {
  id: channelId,
  type: "object",
  patternProperties: {
    ".*": {
      type: "object",
      properties: {
        functionNames: {
          $ref: functionNamesId,
        },
      },
      additionalProperties: false,
    },
  },
};

const validSchema = {
  id: "/Channels",
  type: "object",
  properties: {
    channels: {
      $ref: channelId,
    },
  },
  additionalProperties: false,
};

v.addSchema(ChannelsSchema, channelId);
v.addSchema(FunctionNamesSchema, functionNamesId);

const validateJson = (json) => {
  const isJsonValid = v.validate(json, validSchema);
  return isJsonValid.errors.length === 0;
};

const relationshipMiddleware = (req, res, next) => {
  const validateRule = {
    relationshipString: "required|string",
  };

  validator(req.body, validateRule, {}, (err, passed = true) => {
    if (passed) {
      next();
    } else {
      const validationResponse = validationHandler(err?.errors);
      res.status(validationResponse.status).json(validationResponse);
    }
  });
};

module.exports = {
  validateJson,
  relationshipMiddleware,
};
