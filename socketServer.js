const authSocket = require("./middleware/authSocket");
const { setSocketServerInstance, getOnlineUsers } = require("./serverStore");
const { disconnectHandler } = require("./socketHandler/disconnectHandler");
const {
  newConnectionHandler,
} = require("./socketHandler/newConnectionHandler");
const directMessageHandler = require("./socketHandler/directMessageHandler");
const {
  directChatHistoryHandler,
} = require("./socketHandler/directChatHistoryHandler");
const { roomCreateHandler } = require("./socketHandler/roomCreateHandler");
const { roomJoinHandler } = require("./socketHandler/roomJoinHandler");
const { roomLeaveHandler } = require("./socketHandler/roomLeaveHandler");
const {
  roomInitializeConnectionHandler,
} = require("./socketHandler/roomInitializeConnectionHandler");
const {
  roomSignalingDataHandler,
} = require("./socketHandler/roomSignalingDataHandler");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected");
    console.log(socket.id);
    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });
    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("room-create", () => {
      roomCreateHandler(socket);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });
  setInterval(() => {
    emitOnlineUsers();
  }, [8000]);
};

module.exports = {
  registerSocketServer,
};
