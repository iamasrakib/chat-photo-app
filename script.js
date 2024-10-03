// public/script.js
let ws;

document.getElementById('loginBtn').onclick = function() {
    const username = document.getElementById('username').value;
    if (username === 'AS-Rakib' || username === 'AS-SELI') {
        ws = new WebSocket("ws://localhost:3000");
        
        ws.onopen = function() {
            ws.send(JSON.stringify({ type: "register", username: username }));
            window.location.href = 'chat.html';
        };
    } else {
        alert('Invalid username. Please enter AS-Rakib or AS-SELI.');
    }
};

if (window.location.pathname === '/chat.html') {
    const messagesDiv = document.getElementById('messages');

    ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${data.sender}: ${data.message}`;
            if (data.image) {
                const img = document.createElement('img');
                img.src = data.image;
                img.style.width = "100px";
                messagesDiv.appendChild(img);
            }
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
        }
    };

    document.getElementById('sendBtn').onclick = function() {
        const messageInput = document.getElementById('messageInput');
        const imageInput = document.getElementById('imageInput');

        let image = '';
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onloadend = function() {
                image = reader.result;
                sendMessage(messageInput.value, image);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            sendMessage(messageInput.value, image);
        }
    };
}

function sendMessage(message, image) {
    ws.send(JSON.stringify({
        type: "chat",
        recipient: ws.username === 'AS-Rakib' ? 'AS-SELI' : 'AS-Rakib',
        message: message,
        image: image
    }));
    document.getElementById('messageInput').value = '';
    document.getElementById('imageInput').value = '';
}
