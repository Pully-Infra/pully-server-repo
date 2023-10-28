const handleUnSubscription = (data, socket) => {
  const channel = data.channel;

  if (typeof channel === "string") {
    socket.leave(channel);
  }

  console.log("unsubscribe", channel);
};

module.exports = handleUnSubscription;
