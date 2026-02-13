import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! I'm your AI Career Counselor. I'm here to help you with career advice, learning paths, and answer any questions about your professional development. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSendMessage(location.state.initialMessage);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = null) => {
    const message = messageText || input.trim();
    if (!message) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await aiAPI.chat(message, conversationHistory);
      const assistantMessage = { role: 'assistant', content: response.data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message) {
        errorContent = error.message;
      } else if (error.response?.status === 500) {
        errorContent = '⚠️ The AI service is currently unavailable. This might be due to an invalid or expired OpenAI API key. Please check the server configuration.';
      } else if (error.code === 'ERR_NETWORK') {
        errorContent = '⚠️ Cannot connect to the server. Please make sure the backend server is running on http://localhost:5000';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const suggestedQuestions = [
    "What skills should I learn for a data science career?",
    "How do I transition from frontend to full stack development?",
    "What are the best resources to learn machine learning?",
    "How can I improve my chances of getting a tech job?"
  ];

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Career Counselor</h1>
          <p>Get personalized career advice powered by AI</p>
        </div>

        <div className="chat-box">
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? 'AI' : 'You'}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">AI</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="suggested-questions">
              <p className="suggestions-label">Try asking:</p>
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your career..."
              className="chat-input"
              rows="2"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="send-btn"
            >
              Send →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
