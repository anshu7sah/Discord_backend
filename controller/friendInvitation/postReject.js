const FriendInvitation = require("../../models/FriendInvitationModel");
const {
  updateFriendsPendingInvitation,
} = require("../../socketHandler/updates/friends");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    const invitationExists = await FriendInvitation.exists({ _id: id });
    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    updateFriendsPendingInvitation(userId);
    return res.status(200).send("Invitation successfully rejected");
  } catch (error) {
    return res.status(500).send("Something went wrong please try again");
  }
};

module.exports = postReject;
