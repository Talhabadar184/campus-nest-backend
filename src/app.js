// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// dotenv.config();
// const { Server } = require("socket.io");
// const Chat = require("./models/chat.model");
// const chatRoutes = require("./routes/chat.routes");
// const userRouter = require("./routes/user.routes");
// const searchHostelRoutes = require("./routes/search-hostel.routes.js");
// const registerHostelRoutes = require("./routes/register-hostel.routes.js");
// const compareHostelRoutes = require("./routes/compare-hostel.routes.js");
// const bookingRoutes = require("./routes/booking.routes.js");
// const feedbackRoutes = require("./routes/feedback.routes.js");
// const dashboardRoutes = require("./routes/dashboard.routes.js"); // Add dashboard routes
// const hostelprofileRoutes = require("./routes/hostel.routes.js");

// const { connectDB } = require("./db/index.js");
// const { verifyJWT } = require("./middlewares/auth.middleware.js");

// const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(cookieParser());

// // Routes
// app.use("/api", userRouter);
// app.use("/api/chats", chatRoutes);
// app.use("/api", searchHostelRoutes);
// app.use("/api", registerHostelRoutes);
// app.use("/api", compareHostelRoutes);
// app.use("/api", bookingRoutes);
// app.use("/api", feedbackRoutes);
// app.use("/api", dashboardRoutes);
// app.use("/api/hostel-profile", hostelprofileRoutes);


// // Server and Socket setup
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
  
// });

// // WebSocket Real-time Logic
// io.on("connection", (socket) => {
//   console.log("User connected: Alec", socket.id);

//   socket.on("joinRoom", ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`User joined room: ${roomId}`);
//   });

//   socket.on("sendMessage", async (data) => {
//     const { roomId, senderId, receiverId, message } = data;

//     // Emit message to clients
//     io.to(roomId).emit("receiveMessage", data);

//     // Save message to DB
//     try {
//       let chat = await Chat.findOne({ roomId });
//       const newMessage = { senderId, receiverId, message };

//       if (chat) {
//         chat.messages.push(newMessage);
//       } else {
//         chat = new Chat({ roomId, messages: [newMessage] });
//       }

//       await chat.save();
//       console.log("Message saved to DB");
//     } catch (err) {
//       console.error("Error saving message:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected: ", socket.id);
//   });
// });

// module.exports = server;

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const { Server } = require("socket.io");
const Chat = require("./models/chat.model");
const chatRoutes = require("./routes/chat.routes");
const userRouter = require("./routes/user.routes");
const searchHostelRoutes = require("./routes/search-hostel.routes.js");
const registerHostelRoutes = require("./routes/register-hostel.routes.js");
const compareHostelRoutes = require("./routes/compare-hostel.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const feedbackRoutes = require("./routes/feedback.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes.js"); // Add dashboard routes
const hostelprofileRoutes = require("./routes/hostel.routes.js");
const geocodeRoutes = require("./routes/geocode.routes.js");

const { connectDB } = require("./db/index.js");
const { verifyJWT } = require("./middlewares/auth.middleware.js");

const app = express();

// CORS allowed origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like curl, postman, mobile apps etc.
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Only parse JSON for POST, PUT, PATCH
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api",express.json(), userRouter);
app.use("/api/chats",express.json(), chatRoutes);
app.use("/api",express.json(), searchHostelRoutes);
app.use("/api",express.json(), registerHostelRoutes);
app.use("/api",express.json(), compareHostelRoutes);
app.use("/api",express.json(), bookingRoutes);
app.use("/api",express.json(), feedbackRoutes);
app.use("/api",express.json(), dashboardRoutes);
app.use("/api/hostel-profile", express.json(),hostelprofileRoutes);
app.use("/api", express.json(), geocodeRoutes);

// Server and Socket setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// WebSocket Real-time Logic
io.on("connection", (socket) => {
  console.log("User connected: Alec", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { roomId, senderId, receiverId, message } = data;

    // Emit message to clients
    io.to(roomId).emit("receiveMessage", data);

    // Save message to DB
    try {
      let chat = await Chat.findOne({ roomId });
      const newMessage = { senderId, receiverId, message };

      if (chat) {
        chat.messages.push(newMessage);
      } else {
        chat = new Chat({ roomId, messages: [newMessage] });
      }

      await chat.save();
      console.log("Message saved to DB");
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

module.exports = server;
