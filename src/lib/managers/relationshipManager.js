const { uploader } = require("../services");
const { isJsonString } = require("../../helpers/utils");
const { validateJson } = require("../middleware/relationship");
const { ERROR_MESSAGES } = require("../../helpers/constants");

class RelationshipManager {
  FILE_NAME = "relationships.json";

  constructor() {
    this.loadData();
  }

  data = {};

  loadData = async () => {
    const data = await uploader.getFile(
      {
        key: this.FILE_NAME,
      },
      "utf-8"
    );

    const isJsonValid = isJsonString(data);

    if (isJsonValid) {
      this.data = JSON.parse(data);
    }
  };

  handleUpdate = async (jsonString) => {
    const isJsonValid = isJsonString(jsonString);

    if (isJsonValid) {
      const parsedJson = JSON.parse(jsonString);
      const jsonMatchesSchema = validateJson(parsedJson);

      if (jsonMatchesSchema) {
        const stringifiedJson = JSON.stringify(parsedJson, null, 2);

        const uploadResponse = await uploader.upload(
          [
            {
              body: stringifiedJson,
              fileName: this.FILE_NAME,
            },
          ],
          false
        );

        if (uploadResponse.length > 0) {
          this.data = parsedJson;
          return;
        }

        throw new Error(ERROR_MESSAGES.RELATIONSHIP_VALIDATION_FAILED);
      } else {
        throw new Error(ERROR_MESSAGES.RELATIONSHIP_VALIDATION_FAILED);
      }
    }
  };

  getFunctions = (channelName) => {
    return this.data?.channels?.[channelName]?.functionNames || [];
  };

  getChannels = () => {
    const channelsObject = this.data?.channels;
    return Object.keys(channelsObject);
  };
}

module.exports = RelationshipManager;
