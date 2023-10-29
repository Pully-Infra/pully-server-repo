require("dotenv").config();
const cors = require("cors");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { createClient } = require("redis");
const redisAdapter = require("socket.io-redis");

const {
  ERROR_CODES,
  PULLY_EVENTS,
  SUCCESS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("./helpers/constants");
const { responseHandler } = require("./helpers/response");

const {
  handleSentMessage,
  handleSubscription,
  handleUnSubscription,
} = require("./lib/socket");
const LambdaManager = require("./lib/managers/lambdaManager");
const { authorizeConnection } = require("./lib/middleware/auth");
const RelationshipManager = require("./lib/managers/relationshipManager");
const { relationshipMiddleware } = require("./lib/middleware/relationship");

const PORT = process.env.PORT || 3008;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_PORT = process.env.REDIS_PORT;
const NODE_ENV = process.env.NODE_ENV || "dev";

const NODE_ENV_IS_DEV = NODE_ENV === "dev";

const relationshipManager = new RelationshipManager();
const lambdaManager = new LambdaManager(relationshipManager);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

if (!NODE_ENV_IS_DEV) {
  io.adapter(
    redisAdapter({
      host: REDIS_URL,
      port: REDIS_PORT,
    })
  );
}

const pullyApps = io.of(/.*/);

io.use(authorizeConnection);

app.get("/", (_, res) => {
  res.send("Pully Realtime Infrastructure");
});

let redisPublisher;
let redisSubscriber;

if (!NODE_ENV_IS_DEV) {
  redisPublisher = createClient({ url: REDIS_URL });
  redisSubscriber = createClient({ url: REDIS_URL });

  redisSubscriber.subscribe("update-relationship", (message) => {
    relationshipManager.handleUpdate(message);
  });
}

pullyApps.on("connection", (socket) => {
  console.log("Connected");
  socket.on(PULLY_EVENTS.SUBSCRIBE, (data) => handleSubscription(data, socket));
  socket.on(PULLY_EVENTS.UNSUBSCRIBE, (data) =>
    handleUnSubscription(data, socket)
  );
  socket.on(PULLY_EVENTS.SEND_MESSAGE, (data) =>
    handleSentMessage(data, socket, lambdaManager)
  );
});

app.post("/relationships", relationshipMiddleware, async (req, res) => {
  const relationshipJsonString = req.body.relationshipString;

  try {
    if (!NODE_ENV_IS_DEV) {
      await redisPublisher.publish(
        "update-relationships",
        relationshipJsonString
      );
    } else {
      await relationshipManager.handleUpdate(relationshipJsonString);
    }

    const response = responseHandler({
      status: SUCCESS_CODES.OK,
      message: SUCCESS_MESSAGES.RELATIONSHIP_UPDATED,
    });

    res.status(response.status).json(response);
  } catch (err) {
    console.log("Error with updating relationship.json file: ", err);

    const errResponse = responseHandler({
      status: ERROR_CODES.VALIDATION_FAILED,
      message: ERROR_MESSAGES.VALIDATION_FAILED,
      errors: [
        {
          message:
            err?.message || ERROR_MESSAGES.RELATIONSHIP_VALIDATION_FAILED,
        },
      ],
    });

    res.status(errResponse.status).json(errResponse);
  }
});

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
