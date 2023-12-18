const FriendInvitation = require("../../models/FriendInvitationModel");
const User = require("../../models/user");
const {
  updateFriendsPendingInvitation,
  updateFriends,
} = require("../../socketHandler/updates/friends");
const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send("Error occured. Please try again");
    }
    const { senderId, receiverId } = invitation;

    //add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    //delete invitation
    await FriendInvitation.findByIdAndDelete(id);
    const anotherInvitationIfExist = await FriendInvitation.exists({
      receiverId: senderId,
      senderId: receiverId,
    });
    if (anotherInvitationIfExist) {
      await FriendInvitation.findOneAndDelete({
        senderId: receiverId,
        receiverId: senderId,
      });
      updateFriendsPendingInvitation(senderId.toString());
    }

    //update list of the friends if the users are online
    updateFriends(senderId.toString());
    updateFriends(receiverId.toString());

    //update list of friends pending invitation

    updateFriendsPendingInvitation(receiverId.toString());

    return res.status(200).send("Friend successfully added");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong. Please try again.");
  }
};

module.exports = postAccept;
