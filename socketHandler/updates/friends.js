const User = require("../../models/user");
const FriendInvitation = require("../../models/FriendInvitationModel");
const {
  getActiveConnections,
  getSocketServerInstance,
} = require("../../serverStore");

const updateFriendsPendingInvitation = async (userId) => {
  try {
    const receiverList = getActiveConnections(userId);
    if (receiverList.length > 0) {
      const pendingInvitations = await FriendInvitation.find({
        receiverId: userId,
      }).populate("senderId", "_id username email");
      //checking if the receiver user is online or not

      const io = getSocketServerInstance();
      receiverList.forEach((receiverSockerId) => {
        io.to(receiverSockerId).emit("friends-invitations", {
          pendingInvitations,
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateFriends = async (userId) => {
  try {
    //find active connectons of specific id (online users)
    const receiverList = getActiveConnections(userId);
    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username email"
      );
      if (user) {
        const friendList = user.friends.map((f) => {
          return {
            id: f._id,
            email: f.email,
            username: f.username,
          };
        });

        //get io server instance
        const io = getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-list", {
            friends: friendList ? friendList : [],
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateFriendsPendingInvitation,
  updateFriends,
};
