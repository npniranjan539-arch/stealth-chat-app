let dateAdded = false;
let unreadCount = 0;
let stealth = false;
let hiddenMessages = [];
let messages = [];

let selectedMessage = null;

// Save messages in localStorage
function saveMessages() {
    localStorage.setItem(
        "stealthMessages",
        JSON.stringify(messages)
    );
}
function searchMessages() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const allMessages =
        document.querySelectorAll(
            ".message, .reply"
        );

    allMessages.forEach(msg => {

        const text = msg.textContent.toLowerCase();

        if (text.includes(searchText)) {
            msg.style.display = "block";
        } else {
            msg.style.display = "none";
        }

    });
}

// Load messages from localStorage
function loadMessages() {

    const savedMessages = localStorage.getItem("stealthMessages");

    if (!savedMessages) return;

    messages = JSON.parse(savedMessages);

    const chatBox = document.getElementById("chatBox");

    messages.forEach(item => {

        const msg = document.createElement("div");

        if (item.type === "sent") {
            msg.classList.add("message");
            msg.oncontextmenu = function(e){

    e.preventDefault();

    selectedMessage = this;

    const menu =
        document.getElementById("contextMenu");

    menu.style.display = "block";

    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
};
const pinned =
    localStorage.getItem(
        "pinnedMessage"
    );

if(pinned){

    document.getElementById(
        "pinnedMessage"
    ).textContent =
        "📌 " + pinned;
}

           msg.innerHTML = `
    ${item.text}
    <div class="meta">
        <span class="time">${item.time}</span>
        <span class="tick">✓✓</span>
    </div>
`;

msg.dataset.id = item.id;

msg.ondblclick = function () {
    deleteMessage(this.dataset.id, this);
};
        } else {

            msg.classList.add("reply");

            msg.innerHTML = `
                ${item.text}
                <div class="meta">
                    <span class="time">${item.time}</span>
                </div>
            `;
        }

        chatBox.appendChild(msg);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleStealth() {
    stealth = !stealth;

    const btn = document.querySelector(".header button");
    const status = document.getElementById("status");

    btn.textContent = stealth ? "ON" : "OFF";

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
    const message = input.value.trim();

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
         addDateSeparator();
         const emptyState =
document.getElementById(
    "emptyState"
);

if(emptyState){

    emptyState.style.display =
        "none";
}
    chatBox.appendChild(msg);
    scrollToBottom();

    // Save sent message
   const messageId = Date.now();

msg.dataset.id = messageId;

msg.ondblclick = function () {
    deleteMessage(this.dataset.id, this);
};

messages.push({
    id: messageId,
    text: message,
    type: "sent",
    time: time
});

    saveMessages();
      updateStats();
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    if (stealth) {
        hiddenMessages.push(msg);
        status.textContent = "offline";
        return;
    }

    setTimeout(() => {
        const tick = msg.querySelector(".tick");
        tick.innerHTML = "✓✓";
    }, 1500);

    setTimeout(() => {
        const tick = msg.querySelector(".tick");
        tick.classList.add("blue");
    }, 3000);

    setTimeout(() => {

    document.getElementById(
        "typingIndicator"
    ).style.display = "block";

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
      unreadCount++;
     updateUnreadCounter();

        chatBox.appendChild(reply);
        scrollToBottom();

document.getElementById(
    "typingIndicator"
).style.display = "none";

saveMessages();
        // Save reply message
       messages.push({
    id: Date.now(),
    text: "Reply: " + message,
    type: "reply",
    time: replyTime
});

        saveMessages();
          updateStats();
        chatBox.scrollTop = chatBox.scrollHeight;

        status.textContent = "last seen " + replyTime;

    }, 5000);
}
function deleteMessage(messageId, element) {

    messages = messages.filter(
        msg => msg.id != messageId
    );

    saveMessages();
    updateStats();
    element.remove();
}
// Load chat when page opens
window.onload = function(){

    loadMessages();
   updateStats();
    const theme =
        localStorage.getItem(
            "theme"
        );

    if(theme === "dark"){

        document.body.classList.add(
            "dark-mode"
        );
    }
    updateUnreadCounter();
};
document.addEventListener("click", () => {

    document.getElementById(
        "contextMenu"
    ).style.display = "none";

});
function copyMessage(){

    navigator.clipboard.writeText(
        selectedMessage.innerText
    );

    showToast(
        "✅ Message Copied"
    );
}
function deleteSelectedMessage(){

    const text =
        selectedMessage.childNodes[0]
        .textContent
        .trim();

    messages = messages.filter(
        msg => msg.text !== text
    );

    saveMessages();
     updateStats();
    selectedMessage.remove();
    showToast(
    "🗑️ Message Deleted"
);
}
function editMessage(){

    const oldText =
        selectedMessage.childNodes[0]
        .textContent.trim();

    const newText =
        prompt("Edit Message", oldText);

    if(!newText) return;

    selectedMessage.childNodes[0]
        .textContent = newText + " ";

    const msg = messages.find(
        item => item.text === oldText
    );

    if(msg){
        msg.text = newText;
        saveMessages();
    }
    showToast(
    "✏️ Message Updated"
);
}
function pinMessage(){

    const text =
        selectedMessage.childNodes[0]
        .textContent.trim();

    document.getElementById(
        "pinnedMessage"
    ).textContent =
        "📌 " + text;

    localStorage.setItem(
        "pinnedMessage",
        text
    );
    showToast(
    "📌 Message Pinned"
);
}
function unpinMessage(){

    document.getElementById(
        "pinnedMessage"
    ).textContent =
        "No pinned message";

    localStorage.removeItem(
        "pinnedMessage"
    );
    showToast(
    "📍 Message Unpinned"
);

}
function reactMessage(){

    const emoji = prompt(
        "Enter Emoji: 👍 ❤️ 😂 😮 😢"
    );

    if(!emoji) return;

    let reaction =
        selectedMessage.querySelector(
            ".reaction"
        );

    if(!reaction){

        reaction =
            document.createElement(
                "div"
            );

        reaction.classList.add(
            "reaction"
        );

        selectedMessage.appendChild(
            reaction
        );
    }

    reaction.textContent = emoji;
}
function toggleTheme(){

    document.body.classList.toggle(
        "dark-mode"
    );

    if(
        document.body.classList.contains(
            "dark-mode"
        )
    ){
        localStorage.setItem(
            "theme",
            "dark"
        );
    }
    else{
        localStorage.setItem(
            "theme",
            "light"
        );
    }
}
function forwardMessage(){

    const text =
        selectedMessage.childNodes[0]
        .textContent.trim();

    const chatBox =
        document.getElementById(
            "chatBox"
        );

    const time =
        new Date().toLocaleTimeString(
            [],
            {
                hour:'2-digit',
                minute:'2-digit'
            }
        );

    const msg =
        document.createElement(
            "div"
        );

    msg.classList.add(
        "message"
    );

    msg.innerHTML = `
        📤 Forwarded: ${text}
        <div class="meta">
            <span class="time">${time}</span>
            <span class="tick">✓✓</span>
        </div>
    `;

    chatBox.appendChild(
        msg
    );

    messages.push({
        text:
            "📤 Forwarded: " +
            text,
        type:"sent",
        time:time
    });

    saveMessages();

    chatBox.scrollTop =
        chatBox.scrollHeight;
        showToast(
    "📤 Message Forwarded"
);
}
function updateStats(){

    const total =
        messages.length;

    const sent =
        messages.filter(
            msg => msg.type === "sent"
        ).length;

    const replies =
        messages.filter(
            msg => msg.type === "reply"
        ).length;

    document.getElementById(
        "stats"
    ).textContent =
        `Total: ${total} | Sent: ${sent} | Replies: ${replies}`;
}
function exportChat(){

    let chatData = "";

    messages.forEach(msg => {

        chatData +=
            `[${msg.time}] ${msg.text}\n`;

    });

    const blob =
        new Blob(
            [chatData],
            { type:"text/plain" }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "stealth-chat.txt";

    link.click();
}
function updateUnreadCounter(){

    document.getElementById(
        "unreadCounter"
    ).textContent =
        `Unread Messages: ${unreadCount}`;
}
document.getElementById(
    "chatBox"
).addEventListener(
    "click",
    function(){

        unreadCount = 0;

        updateUnreadCounter();
    }
);
function addDateSeparator(){

    if(dateAdded) return;

    const chatBox =
        document.getElementById(
            "chatBox"
        );

    const separator =
        document.createElement(
            "div"
        );

    separator.classList.add(
        "date-separator"
    );

    separator.textContent =
        "Today";

    chatBox.appendChild(
        separator
    );

    dateAdded = true;
}
function scrollToBottom(){

    const chatBox =
        document.getElementById(
            "chatBox"
        );

    chatBox.scrollTop =
        chatBox.scrollHeight;
}
function clearChat(){

    const confirmDelete =
        confirm(
            "Clear all messages?"
        );

    if(!confirmDelete){
        return;
    }

    messages = [];

    localStorage.removeItem(
        "stealthMessages"
    );

    location.reload();
}
function handleEnter(event){

    if(event.key === "Enter"){

        sendMessage();
    }
}
function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.style.display =
        "block";

    setTimeout(() => {

        toast.style.display =
            "none";

    }, 2000);
}