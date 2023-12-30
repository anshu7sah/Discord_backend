const {
  getSocketServerInstance,
  getActiveRooms,
} = require("../../serverStore");

const updateRooms = (toSpecifiedTargetId = null) => {
  const io = getSocketServerInstance();
  const activeRooms = getActiveRooms();
  console.log("active", activeRooms);

  if (toSpecifiedTargetId) {
    io.to(toSpecifiedTargetId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};

module.exports = {
  updateRooms,
};
