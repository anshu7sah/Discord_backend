const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();
let activeRooms = [];

let io;
const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};
const getSocketServerInstance = () => {
  return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  console.log(connectedUsers);
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("new connected user");
    console.log(connectedUsers);
  }
};
const getActiveConnections = (userId) => {
  const activeconnections = [];
  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeconnections.push(key);
    }
  });
  return activeconnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
  return onlineUsers;
};

//Rooms
const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreater: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: uuidv4(),
  };
  activeRooms = [...activeRooms, newActiveRoom];

  return newActiveRoom;
};

const getActiveRooms = () => {
  return [...activeRooms];
};
const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find(
    (activeRoom) => activeRoom?.roomId === roomId
  );
  if (activeRoom) {
    return { ...activeRoom };
  } else {
    return null;
  }
};

const joinActiveRoom = (roomId, newParticipant) => {
  // const room = activeRooms.find(
  //   (activeRoom) => activeRoom.roomId === roomId
  // );
  // activeRooms=activeRooms.filter((room)=>room.roomId!==roomId);
  const rooms = activeRooms.map((room) => {
    if (room?.roomId === roomId) {
      return {
        ...room,
        participants: [...room.participants, newParticipant],
      };
    } else {
      return room;
    }
  });

  activeRooms = [...rooms];
};
const leaveActiveRoom = (roomId, participantSocketId) => {
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);
  // const result = activeRooms.map((room) => {
  //   if (room?.roomId === roomId) {
  //     room.participants = room.participants.filter(
  //       (participant) => participant.socketId != participantSocketId
  //     );
  //     if (room.participants.length > 0) {
  //       return room;
  //     }
  //   } else {
  //     return room;
  //   }
  // });
  if (activeRoom) {
    const activeParticipant = activeRoom.participants.some(
      (participant) => participant.socketId === participantSocketId
    );
    if (activeParticipant) {
      activeRoom.participants = activeRoom.participants.filter(
        (participant) => participant.socketId != participantSocketId
      );
    }
    const newRooms = activeRooms.filter(
      (room) => room.roomId != activeRoom.roomId
    );
    if (activeRoom.participants?.length > 0) {
      newRooms.push(activeRoom);
    }
    activeRooms = [...newRooms];
  }
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  getSocketServerInstance,
  setSocketServerInstance,
  getOnlineUsers,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
};
