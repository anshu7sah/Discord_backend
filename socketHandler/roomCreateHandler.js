const { addNewActiveRoom } = require("../serverStore");
const { updateRooms } = require("./updates/rooms");

const roomCreateHandler = (socket) => {
  const socketId = socket.id;
  const userId = socket.user.userId;
  console.log("in socketHandler in room create Handler");

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit("room-create", {
    roomDetails,
  });
  updateRooms();
};

module.exports = {
  roomCreateHandler,
};
