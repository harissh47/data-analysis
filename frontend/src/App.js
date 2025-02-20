import React, { useState } from 'react';
import { uploadFile, sendChatMessage } from './api';
import './App.css';

const ChatMessage = ({ message }) => {
  if (message.sender === 'bot') {
    if (typeof message.text === 'object') {
      // Handle formatted summary responses
      const response = message.text;
      
      if (response.type === 'summary') {
        return (
          <div className={`chat-message ${message.sender} summary-message`}>
            {response.sections.map((section, index) => (
              <div key={index} className="summary-section">
                <h3 className="summary-title">{section.title}</h3>
                <ul className="summary-list">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className={`chat-message ${message.sender}`}>
          {response.content}
        </div>
      );
    }

    // Split text by ** headers
    const sections = message.text.split('**').filter(Boolean);
    if (sections.length > 1) {
      return (
        <div className="chat-sections">
          {sections.map((section, index) => {
            if (!section.trim()) return null;
            const [title, ...content] = section.split(':');
            if (!content.length) return null;
            
            return (
              <div key={index} className={`chat-message ${message.sender} section-message`}>
                <h3 className="section-title">{title.trim()}</h3>
                <div className="section-content">
                  {content.join(':').trim()}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <div className={`chat-message ${message.sender}`}>
      {message.text}
    </div>
  );
};

const App = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const data = await uploadFile(file);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.message },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending user messages
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    const currentInput = userInput;
    setUserInput('');
    setLoading(true);
    setError('');

    try {
      const data = await sendChatMessage(currentInput);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.response },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">Hi, welcome to Data AI</header>
      <main className="chat-container">
        {error && <div className="error-message">{error}</div>}
        {chatMessages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {loading && <div className="loader">Processing...</div>}
      </main>

      <footer className="footer">
        <input
          type="file"
          accept=".csv, .xlsx"
          className="file-upload"
          onChange={handleFileUpload}
        />
        <div className="chat-input">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage} 
            className="send-button"
            disabled={loading || !userInput.trim()}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
