const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const app = require("./src/app.js");
const { connectDB } = require("./src/db/index.js");
const Chat = require("./src/models/chat.model");

dotenv.config();

const server = http.createServer(app);

// ✅ Socket Setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://campusnest-one.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (data) => {
    const { roomId, senderId, receiverId, message } = data;

    io.to(roomId).emit("receiveMessage", data);

    try {
      let chat = await Chat.findOne({ roomId });

      const newMessage = { senderId, receiverId, message };

      if (chat) {
        chat.messages.push(newMessage);
      } else {
        chat = new Chat({ roomId, messages: [newMessage] });
      }

      await chat.save();
    } catch (err) {
      console.error("DB Error:", err);
    }
  });
});

// ✅ START SERVER ONLY HERE
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });