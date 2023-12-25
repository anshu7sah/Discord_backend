const { getActiveRoom, joinActiveRoom } = require("../serverStore");
const { updateRooms } = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;
  const participantDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
  };
  const roomDetails = getActiveRoom(roomId);
  joinActiveRoom(roomId, participantDetails);

  //send information to users in room that they should prepare for incoming connections
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId !== participantDetails.socketId) {
      socket.to(participant.socketId).emit("connection-prepare", {
        connUserSocketId: participantDetails.socketId,
      });
    }
  });

  updateRooms();
};

module.exports = {
  roomJoinHandler,
};
