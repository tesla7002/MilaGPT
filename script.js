const darkModeToggle = document.getElementById('dark-mode-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const body = document.querySelector('body');
const userInput = document.getElementById('user-input');
const chatbotMessages = document.getElementById('chatbot-messages');


//default dark mode
chatbotContainer.classList.toggle('dark-mode');
body.classList.toggle('dark-mode');
userInput.classList.toggle('dark-mode-input');

// Toggle dark mode for existing messages
const messages = document.querySelectorAll('.message');
messages.forEach(message => {
  message.classList.toggle('dark-mode');
});

darkModeToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('dark-mode');
    body.classList.toggle('dark-mode');
    userInput.classList.toggle('dark-mode-input');
  
    // Toggle dark mode for existing messages
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
      message.classList.toggle('dark-mode');
    });
});


function sendMessage() {
  const message = userInput.value.trim();
  if (message !== '') {
    addMessage(message, 'user');
    userInput.value = '';

      // Add typing indicator with spinning GIF image
    const typingIndicator = addMessage('', 'chatbot');
    typingIndicator.innerHTML = '<img src="spin.gif" alt="Typing..." class="typing-indicator">';

    fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
            question: message,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const response = data.response;

        // Remove typing indicator
        if (typingIndicator) {
            typingIndicator.parentNode.removeChild(typingIndicator);
        }

        addMessage(response, 'chatbot');
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
}
  
function addMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender === 'user' ? 'user' : 'chatbot');
  messageElement.innerHTML = marked(message);
  chatbotMessages.appendChild(messageElement);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  return messageElement; // Return the message element
}
  

document.getElementById('send-button').addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage();
  }
});


function auto_grow(element) {
  element.style.height = "13px";
  element.style.height = (element.scrollHeight - 20) + "px";
}


