const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

// Routes
const chatRoutes = require("./routes/chat.routes");
const userRouter = require("./routes/user.routes");
const searchHostelRoutes = require("./routes/search-hostel.routes.js");
const registerHostelRoutes = require("./routes/register-hostel.routes.js");
const compareHostelRoutes = require("./routes/compare-hostel.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const feedbackRoutes = require("./routes/feedback.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes.js");
const hostelprofileRoutes = require("./routes/hostel.routes.js");
const geocodeRoutes = require("./routes/geocode.routes.js");

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://campusnest-one.vercel.app",
];

// ✅ Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", userRouter);
app.use("/api/chats", chatRoutes);
app.use("/api/search-hostel", searchHostelRoutes);
app.use("/api/register-hostel", registerHostelRoutes);
app.use("/api/compare-hostel", compareHostelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hostel-profile", hostelprofileRoutes);
app.use("/api/geocode", geocodeRoutes);

module.exports = app;