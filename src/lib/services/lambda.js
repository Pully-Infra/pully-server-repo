const { GENERAL_CONFIG } = require("../../config/config");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const client = new LambdaClient(GENERAL_CONFIG);

class LambdaService {
  async invokeLambda(functionName, payload) {
    try {
      const input = {
        LogType: "Tail",
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
        InvocationType: "RequestResponse",
      };

      const command = new InvokeCommand(input);
      const response = await this.client.send(command);
      const responseObject = response.Payload;
      const decodedResponseObject = Buffer.from(responseObject).toString();
      const jsonResponse = JSON.parse(decodedResponseObject);

      return jsonResponse;
    } catch (error) {
      console.log(`Lambda invocation failed with error: ${error}`);
      return null;
    }
  }

  constructor() {
    this.client = client;
  }
}

module.exports = LambdaService;
