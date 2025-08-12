import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// server.js or app.js
app.set('trust proxy', 1);

app.use(
  cors({
    origin: "https://skill-swap-frontend-y5p3.onrender.com",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // to parse json in body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to parse url
app.use(express.static("public")); // to use static public folder
app.use(cookieParser()); // to enable CRUD operation on browser cookies

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://skill-swap-frontend-y5p3.onrender.com");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Add other CORS headers as needed
  next();
});

// Passport middleware
app.use(passport.initialize());

// Importing routes
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import requestRouter from "./routes/request.routes.js";
import reportRouter from "./routes/report.routes.js";
import ratingRouter from "./routes/rating.routes.js";

// Using routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/request", requestRouter);
app.use("/report", reportRouter);
app.use("/rating", ratingRouter);

// ---------- DEPLOYMENT CONFIGURATION ----------

app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../Frontend/dist/index.html"));
});

// ----------------------------------------------



export { app };
