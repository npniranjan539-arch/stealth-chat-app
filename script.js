let stealth = false;
let hiddenMessages = [];

function toggleStealth() {
    stealth = !stealth;

    const btn = document.querySelector(".header button");
    const status = document.getElementById("status");

    btn.textContent = stealth ? "ON" : "OFF";

    // when stealth OFF deliver hidden messages
    if (!stealth && hiddenMessages.length > 0) {

        hiddenMessages.forEach(item => {

            const tick = item.querySelector(".tick");

            setTimeout(() => {
                tick.innerHTML = "✓✓";
            }, 500);

            setTimeout(() => {
                tick.classList.add("blue");
            }, 1500);

        });

        hiddenMessages = [];
        status.textContent = "online";
    }
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;

    if (!message) return;

    const chatBox = document.getElementById("chatBox");
    const status = document.getElementById("status");

    const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const msg = document.createElement("div");
    msg.classList.add("message");

    msg.innerHTML = `
        ${message}
        <div class="meta">
            <span class="time">${time}</span>
            <span class="tick">✓</span>
        </div>
    `;

    chatBox.appendChild(msg);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // if stealth ON store message
    if (stealth) {
        hiddenMessages.push(msg);
        status.textContent = "offline";
        return;
    }

    // normal flow
    setTimeout(() => {
        const tick = msg.querySelector(".tick");
        tick.innerHTML = "✓✓";
    }, 1500);

    setTimeout(() => {
        const tick = msg.querySelector(".tick");
        tick.classList.add("blue");
    }, 3000);

    setTimeout(() => {
        status.textContent = "typing...";
    }, 3200);

    setTimeout(() => {

        const reply = document.createElement("div");
        reply.classList.add("reply");

        const replyTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        reply.innerHTML = `
            Reply: ${message}
            <div class="meta">
                <span class="time">${replyTime}</span>
            </div>
        `;

        chatBox.appendChild(reply);
        chatBox.scrollTop = chatBox.scrollHeight;

        status.textContent = "last seen " + replyTime;

    }, 5000);
}