const Conversation = require("../models/Conversation");
const { updateChatHistory } = require("./updates/chats");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });
    if (conversation) {
      updateChatHistory(conversation._id.toString(), socket.id);
    } else {
      const conversation = await Conversation.create({
        participants: [userId, receiverUserId],
        messages: [],
      });
      updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  directChatHistoryHandler,
};
