const connectedUsers = new Map();

let io;
const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getSocketServerInstance = () => {
  return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log(connectedUsers);
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("new connected user");
    console.log(connectedUsers);
  }
};
const getActiveConnections = (userId) => {
  const activeconnections = [];
  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeconnections.push(key);
    }
  });
  return activeconnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
  return onlineUsers;
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  getSocketServerInstance,
  setSocketServerInstance,
  getOnlineUsers,
};
