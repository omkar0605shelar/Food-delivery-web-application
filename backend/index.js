import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Required when using secure cookies behind Render proxy
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// parse allowed origins from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// For safety: if env is empty, fallback to localhost for dev
if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
}
console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // if the origin exactly matches any in allowed list — allow it
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("Blocked by CORS, origin:", origin);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // IMPORTANT: allow cookies
    optionsSuccessStatus: 200,
  })
);

// --- routes etc ---
app.get("/", (req, res) => res.send("Backend is running..."));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
