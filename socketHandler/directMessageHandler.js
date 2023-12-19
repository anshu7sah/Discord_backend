const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { updateChatHistory } = require("./updates/chats");

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    //Create new message
    const message = await Message.create({
      content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    //find if conversation exist with two user
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });
    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();
      updateChatHistory(conversation._id);
    } else {
      //Create new conversation

      const newConversation = await Conversation.create({
        participants: [userId, receiverUserId],
        messages: [message._id],
      });
      updateChatHistory(newConversation._id);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
