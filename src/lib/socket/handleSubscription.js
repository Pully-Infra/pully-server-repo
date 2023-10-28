const handleSubscription = (data, socket) => {
  const channel = data.channel;

  if (typeof channel === "string") {
    socket.join(channel);
  }

  console.log("subscribe", channel);
};

module.exports = handleSubscription;
