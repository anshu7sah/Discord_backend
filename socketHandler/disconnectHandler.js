const { removeConnectedUser, getActiveRooms } = require("../serverStore");
const { roomLeaveHandler } = require("./roomLeaveHandler");

const disconnectHandler = (socket) => {
  const activeRooms = getActiveRooms();

  activeRooms.forEach((activeRoom) => {
    const userInRoom = activeRoom?.participants.some(
      (participant) => participant.socketId === socket.id
    );
    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: activeRoom.roomId });
    }
  });

  removeConnectedUser(socket.id);
};

module.exports = {
  disconnectHandler,
};
