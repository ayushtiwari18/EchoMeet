import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    // This is the important part  to allow cross-origin requests in production we need to remove this and add the domain of the frontend
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Someone connected");

    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      if (!messages[path]) {
        messages[path] = []; // Initialize messages[path] if it doesn't exist
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      connections[path].forEach((socketId, i) => {
        io.to(socketId).emit(
          "chat-message",
          messages[path][i]?.data || "",
          messages[path][i]?.sender || "",
          messages[path][i]?.["socket-id-sender"] || ""
        );
      });
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, found], [roomkey, roomvalue]) => {
          if (!found && roomvalue.includes(socket.id)) {
            return [roomkey, true];
          }
          return [room, found];
        },
        ["", false]
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("messages", matchingRoom, ":", sender, data);
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });
    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());
      var key;
      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let i = 0; i < connections[key].length; ++i) {
              io.to(connections[key][i]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });

  return io;
};
