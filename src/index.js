import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_API, NODE_ENV, PORT } from "./constant/env.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import socketConfig from "./config/socket.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
const app = express();
const server = createServer(app);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const clientBuildPath = path.join(__dirname, "../../web/dist");

// ===== Middlewares =====
// if (NODE_ENV !== "production") {
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// }
app.use(cookieParser());
app.use(express.json());
// ===== API Routes =====
app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.use("/api", routes);
// Handle unknown API routes
app.use("/api", notFoundHandler);

// app.use(express.static(clientBuildPath));
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(clientBuildPath, "index.html"));
// });

// ===== Database + Server Init =====
connectDB().then(() => {
  if (NODE_ENV !== "production") {
    server.listen(PORT, () => {
      console.log(
        `✅ Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`
      );
    });
  }
  // else {
  //     // ===== Serve React Frontend =====
  //     app.use(express.static(clientBuildPath));
  //     app.get(/.*/, (req, res) => {
  //         res.sendFile(path.join(clientBuildPath, "index.html"));
  //     });
  // }
});

// ===== Error Handler (last) =====
app.use(errorHandler);
// ===== Socket.io =====
socketConfig(server);
export default app;
