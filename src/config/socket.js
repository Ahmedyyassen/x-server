import { Server as SocketIoServer } from "socket.io";
import { CLIENT_API } from "../constant/env.js";
import MessageModel from "../model/Message.model.js";
import ConversationModel from "../model/conversation.model.js";
const socketConfig = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: CLIENT_API,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
        io.emit("onlineUsers", Array.from(userSocketMap.keys()));
    };
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSoketId = userSocketMap.get(message.recipient);
        const createdMessage = await MessageModel.create(message);
        const messageData = await MessageModel.findById(createdMessage._id);
        await ConversationModel.findByIdAndUpdate(message.conversationId, {
            $push: { messages: createdMessage._id }, // append new message ID
            $set: { lastMessage: createdMessage._id, updatedAt: new Date() }
        }, { new: true } // return updated conversation (optional)
        );
        if (recipientSoketId) {
            io.to(recipientSoketId).emit("reciveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("reciveMessage", messageData);
        }
    };
    const typingHandle = (data) => {
        const senderSocketId = userSocketMap.get(data.sender);
        const recipientSoketId = userSocketMap.get(data.recipient);
        if (recipientSoketId && senderSocketId) {
            io.to(recipientSoketId).emit("show_typing_status", data.sender);
        }
    };
    const stopTypingHandle = (data) => {
        const senderSocketId = userSocketMap.get(data.sender);
        const recipientSoketId = userSocketMap.get(data.recipient);
        if (recipientSoketId && senderSocketId) {
            io.to(recipientSoketId).emit("clear_typing_status", data.sender);
        }
    };
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(userSocketMap.keys()));
            console.log(`User connected: ${userId} with socket id ${socket.id}`);
        }
        else {
            console.log("User ID not provided during connection.");
        }
        // listen to send message emitter
        socket.on("sendMessage", sendMessage);
        socket.on("typing", typingHandle);
        socket.on("stop_typing", stopTypingHandle);
        socket.on("disconnect", () => disconnect(socket));
    });
};
export default socketConfig;
