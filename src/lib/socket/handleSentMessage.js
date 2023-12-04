const { PULLY_EVENTS } = require("../../helpers/constants");

const handleSentMessage = async (data, socket, namespaces, lambdaManager) => {
  const { message, event, channelName } = data;
  const result = await lambdaManager.callLambdas(channelName, {
    event: "MessageEvent",
    payload: message,
  });

  const appName = socket.appName;
  const connectedClients = namespaces.get(appName)?.sockets;
  const size = connectedClients?.size || 0;

  if (size > 0) {
    for (const [_, socket] of connectedClients) {
      socket.emit(event || PULLY_EVENTS.RECEIVE_MESSAGE, {
        channel: channelName,
        data: result?.payload,
      });
    }
  }
};

module.exports = handleSentMessage;
