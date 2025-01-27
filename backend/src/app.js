import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "../src/controllers/socketManager.js";

import { Server } from "socket.io";

import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express(); // create express app
const server = createServer(app); // create server from express app instance that used this server for connection with socket.io
const io = connectToSocket(server); // create socket.io instance from server instance

app.set("port", process.env.PORT || 8001); // set port for express app
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes); // use userRoutes for /api/v1/users endpoint incase we need to launch multiple versions of api afterwords we can use /api/v2/users

// Middleware to parse JSON
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is ready Ayush");
});

const start = async () => {
  app.set("mongo_user", "ayushtiwari102003");
  const connectionDb = await mongoose.connect(
    "mongodb+srv://ayushtiwari102003:L1quwqIO5DHAd9kc@cluster0.oeglp.mongodb.net/"
  );
  console.log(`Database connected: ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log(`Server is running on port 8001`);
  });
};

start();
