## Pully Server

### Information

- Server is primarily a websocket server that handles socket io connections.
- Server has post method for validating relationship.json file.
- Makes use of the pully client to subscribe and unsubscribe to/from a channel and to publish messages.

### Major Dependencies

- `@aws-sdk`: Used for communicating with AWS resources
- `redis`: Used to publish the updated relationships file to all subscribers in the case of auto scaling
- `socket.io-redis`: In a distributed system with multiple Node.js processes or servers, each process maintains its own list of connected clients. This means that broadcasting events using Socket.IO's built-in mechanism would only reach clients connected to the same server. This library allows all instances or servers to communicate with each other through Redis.

### Deploying the Pully Infrastructure to your AWS Account

To deploy the Pully infrastructure to your AWS Account, you should make use of the pully cli package or deploy directly from the [deployment repository](https://github.com/Pully-Infra/pully-deploy).

### How is Echo deployed

- The entire application is containerized using Docker. If you want to update the `Dockerfile`, you can clone or fork this repo and run `docker build -t <your-tag>`, then push to docker hub. You then need to change the docker image in the `deploy.js` file in the deployment repository to the new image name.
- Deployment is done using AWS Elastic Container Service. A new ECS Cluster is setup and the dockerized application is added as a task to a fargate service launch type.

### How is Auto Scaling handled

- Auto Scaling policy is set up on the ECS Service to auto scale tasks based on memory and CPU usage. The policy is currently setup to allow a maximum of 4 tasks running at a time.
- AWS Elastic load balancer is also employed to distribute traffic across the several tasks running on ECS.

### Server Routes

- POST (/relationships): Updates relationship.json file.
  - Body (property: type)
    - `relationshipString: string`
  - Response (property: type)
    - `status: number`
    - `message: string`
    - `error: Array<{message: string}>`
