const User = require("../../models/user");
const FriendInvitation = require("../../models/FriendInvitationModel");
const {
  updateFriendsPendingInvitation,
} = require("../../socketHandler/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, email } = req.user;
  if (email.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send("You can not send Invitation to yourseld");
  }
  const targetUser = await User.findOne({
    email: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res
      .status(404)
      .send(
        `Friend of ${targetMailAddress} has not been found. Please check email address.`
      );
  }

  const invitationAlreadyExists = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });
  if (invitationAlreadyExists) {
    return res.status(409).send("Invitation has been already sent");
  }

  //Check if the user which we like to invite already exists
  const userAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );
  if (userAlreadyFriends) {
    return res
      .status(409)
      .send("Friend already added. Please check friends list");
  }

  //Create new invitation
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // if the invitation has been successfully created we would like to update frineds invitation if the other user is online

  // send pending invitations update to specific user
  updateFriendsPendingInvitation(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent.");
};

module.exports = postInvite;
