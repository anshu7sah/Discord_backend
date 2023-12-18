const { addNewConnectedUser } = require("../serverStore");
const {
  updateFriendsPendingInvitation,
  updateFriends,
} = require("./updates/friends");

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;
  addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  //update pending friends invitation list;
  updateFriendsPendingInvitation(userDetails.userId);
  updateFriends(userDetails.userId);
};

module.exports = {
  newConnectionHandler,
};
