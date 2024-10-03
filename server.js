// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

app.use(express.static(path.join(__dirname, 'public')));

// Handle WebSocket connections
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.type === "register") {
            clients[data.username] = ws;
            ws.username = data.username;
            console.log(`${data.username} connected`);
        } else if (data.type === "chat") {
            const recipientWs = clients[data.recipient];
            if (recipientWs) {
                recipientWs.send(JSON.stringify({
                    type: "chat",
                    sender: ws.username,
                    message: data.message,
                    image: data.image
                }));
            }
        }
    });

    ws.on("close", () => {
        console.log(`${ws.username} disconnected`);
        delete clients[ws.username];
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
