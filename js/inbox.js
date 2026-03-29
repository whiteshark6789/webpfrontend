// Mock inbox messages (replace with API later)
const messages = [
  {
    id: 1,
    from: "Customer – Rahul",
    subject: "Order not delivered",
    body: "My order #1023 has not been delivered yet.",
    time: "10:30 AM"
  },
  {
    id: 2,
    from: "Customer – Sneha",
    subject: "Medicine availability",
    body: "Do you have Crocin 650 in stock?",
    time: "Yesterday"
  }
];

const messageList = document.getElementById("messageList");
const messageContent = document.getElementById("messageContent");

messages.forEach(msg => {
  const li = document.createElement("li");
  li.className = "inbox-item";
  li.innerHTML = `
    <strong>${msg.from}</strong>
    <p>${msg.subject}</p>
    <span>${msg.time}</span>
  `;
  li.onclick = () => openMessage(msg);
  messageList.appendChild(li);
});

function openMessage(msg) {
  messageContent.innerHTML = `
    <h3>${msg.subject}</h3>
    <p><strong>From:</strong> ${msg.from}</p>
    <p style="margin-top:15px;">${msg.body}</p>
  `;
}
