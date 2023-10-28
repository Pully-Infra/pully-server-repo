const { lambdaService } = require("../services");

class LambdaManager {
  constructor(relationshipManager) {
    this.relationshipManager = relationshipManager;
  }

  getLambdaInRelationship(channelName) {
    return this.relationshipManager.getFunctions(channelName);
  }

  async callLambdas(channelName, payload) {
    const lambdas = this.getLambdaInRelationship(channelName);

    let message = payload;

    for (let i = 0; i < lambdas.length; i++) {
      const lambda = lambdas[i];
      const response = await lambdaService.invokeLambda(lambda, message);

      if (response) {
        message = response;
      }
    }

    return message;
  }
}

module.exports = LambdaManager;
