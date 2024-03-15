const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const { Server } = require("socket.io")

const app = require("./app.js");

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => {
  console.log(`DB Connection ✅`);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const liveDrivers = new Map();
// const liveDrivers = new Set();

// SOCKET SERVER 
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://ipilot.vercel.app"],
  },
  // maxHttpBufferSize: 1e7, // Set maximum HTTP buffer size (10 MB in this example)
  // pingInterval: 10000, // Set ping interval to 10 seconds
  // pingTimeout: 5000, // Set ping timeout to 5 seconds
  // transports: ["websocket"], // Use WebSocket transport only
});

io.on("connection", (socket) => {
  console.log(socket.id + " joined")

  socket.on("live-drivers", (driverData) => {
    // socket.broadcast.emit("live-drivers", "asdasd")
    // if (!liveDrivers.has(socket.id)) {
    liveDrivers.set(socket.id, driverData)
    // liveDrivers.add(driverData)

    // }
    console.log("live driver _____>", liveDrivers)
    // console.log(driverData)
    io.emit("live-drivers", Array.from(liveDrivers))
    // io.emit("live-drivers", liveDrivers)
  })

  socket.on("SOS", (sosDetails) => {
    console.log(sosDetails)
    io.emit("SOS", sosDetails)
  })

  socket.on("disconnect", () => {
    liveDrivers.delete(socket.id)
    // console.log(socket.id, "A user disconnected");
    // console.log(liveDrivers, "New Map");
    io.emit("live-drivers", Array.from(liveDrivers))
  });
}
)
console.log(liveDrivers)
