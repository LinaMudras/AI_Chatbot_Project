const API_KEY = 'AIzaSyAlcn9KlHH0PyQoXEM9Fu0G5iYhh_dYN_E';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');

const userInput = document.getElementById('user-input');

const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {

    throw new Error('Failed to generate response');
  }

  const data = await response.json();
  // Converts the API response to JSON format

  return data.candidates[0].content.parts[0].text;
  // Returns the first generated response from the API
}

function cleanMarkdown(text) {

  return text
    .replace(/#{1,6}\s?/g, '')

    .replace(/\*\*/g, '')

    .replace(/\n{3,}/g, '\n\n')

    .trim();
}

function addMessage(message, isUser) {

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  messageElement.classList.add(isUser ? 'user-message' : 'bot-message');

  const profileImage = document.createElement('img');
  profileImage.classList.add('profile-image');

  profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';

  profileImage.alt = isUser ? 'User' : 'Bot';                 //if image is not found then show alternative name

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');

  messageContent.textContent = message;

  messageElement.appendChild(profileImage);
  messageElement.appendChild(messageContent);

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();

  if (userMessage) {
    addMessage(userMessage, true);
     
    userInput.value = '';

    sendButton.disabled = true;
    userInput.disabled = true;

    try {
      const botMessage = await generateResponse(userMessage);
      // Calls the `generateResponse` function to get the bot reply

      addMessage(cleanMarkdown(botMessage), false);
      // Adds the bot's cleaned response to the chat.
    } catch (error) {
      console.error('Error:', error);
      // Logs any error that occurs during the bot response.

      addMessage('Sorry, I encountered an error. Please try again.', false);
    
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();

    handleUserInput();
  }
});