const express = require("express");

const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const { registerSocketServer } = require("./socketServer");

// routes end

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

const server = http.createServer(app);
registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error. Server not started");
    console.error(err);
  });
