import { Server } from "socket.io";
import { NextApiResponseWithSocket } from "@/types";

export default function SocketHandler(res: NextApiResponseWithSocket) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    res.send("Already set up");
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // var allClients: any = [];

  // Define actions inside
  io.on("connection", (socket) => {
    // allClients.push(socket);
    // console.log(allClients);

    socket.on("createdUser", ({ username }: { username: string }) => {
      socket.broadcast.emit("newUser", username);
    });

    socket.on("createdMessage", (msg: { author: string; message: string }) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    });

    socket.on("disconnect", function () {
      console.log("Got disconnect!");
      // var i = allClients.indexOf(socket);
      // allClients.splice(i, 1);

      // socket.broadcast.emit("disconnectUser");
    });
  });

  res.send("Setting up socket");
}
