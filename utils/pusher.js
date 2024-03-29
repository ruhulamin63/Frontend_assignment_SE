import Pusher from "pusher-js";

const pusher = new Pusher(
  "88d3dc924caf9db4a4f2", //app key
  {
    cluster: "ap2",
    // Additional options if needed
  }
);

export default pusher;
