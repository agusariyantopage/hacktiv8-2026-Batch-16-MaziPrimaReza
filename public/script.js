const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Maintain the conversation history to provide context for the AI
let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add the user's message to the chat box and clear input
  appendMessage('user', userMessage);
  input.value = '';

  // 2. Update the local conversation history
  conversation.push({ role: 'user', text: userMessage });

  // 3. Show a temporary "Thinking..." message
  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    // 4. Send the POST request to the backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.result) {
      // 5. Replace "Thinking..." with the actual AI response
      botMessageElement.textContent = data.result;
      // 6. Add the AI's response to the conversation history
      conversation.push({ role: 'model', text: data.result });
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error:', error);
    // botMessageElement.textContent = 'Failed to get response from server.';
    botMessageElement.textContent = 'Failed: ' + error.message;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element so we can update its content later
}
