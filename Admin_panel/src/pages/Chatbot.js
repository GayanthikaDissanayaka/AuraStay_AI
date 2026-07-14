import React, { useState } from 'react';
import { auth } from "../firebase/firebase";
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your hotel assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const botResponses = {
    'booking': 'I can help you with room bookings. Please check our available rooms in the Hotel section.',
    'restaurant': 'Our restaurant serves breakfast from 7-10 AM, lunch 12-3 PM, and dinner 7-11 PM.',
    'amenities': 'We have a swimming pool, gym, spa, and free WiFi throughout the hotel.',
    'checkout': 'Checkout time is 11 AM. Would you like to request a late checkout?',
    'room service': 'Room service is available 24/7. You can order from our Food Menu section.',
    'default': "I'm here to assist! You can ask about bookings, restaurant, amenities, checkout, or room service."
  };

  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMsg.includes(key)) {
        return response;
      }
    }
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const botMessage = {
      id: messages.length + 2,
      text: getBotResponse(inputMessage),
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <h3>Hotel Assistant</h3>
            <p>Online</p>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-bubble">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">
            Send
          </button>
        </div>

        <div className="quick-questions">
          <p>Quick questions:</p>
          <div className="quick-buttons">
            <button onClick={() => setInputMessage('How to book a room?')}>Booking</button>
            <button onClick={() => setInputMessage('Restaurant timings')}>Restaurant</button>
            <button onClick={() => setInputMessage('Hotel amenities')}>Amenities</button>
            <button onClick={() => setInputMessage('Checkout time')}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;