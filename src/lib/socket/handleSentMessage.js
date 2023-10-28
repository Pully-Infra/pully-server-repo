const { PULLY_EVENTS } = require("../../helpers/constants");

const handleSentMessage = async (data, socket, lambdaManager) => {
  const { message, event, channelName, token } = data;

  // Validate token

  const result = await lambdaManager.callLambdas(channelName, {
    event: "MessageEvent",
    payload: message,
  });

  socket.emit(event || PULLY_EVENTS.RECEIVE_MESSAGE, {
    channel: channelName,
    data: result?.payload,
  });
};

module.exports = handleSentMessage;
