import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaLanguage,
  FaDownload,
  FaTrash
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

// Component to render markdown-formatted messages
const MessageRenderer = ({ text, isUser }) => {
  if (isUser) {
    return <span>{text}</span>;
  }

  // Split text into lines and process markdown-like formatting
  const lines = text.split('\n');
  const processedLines = lines.map((line, index) => {
    // Headers
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          margin: '1rem 0 0.5rem 0',
          color: '#333'
        }}>
          {line.replace('## ', '')}
        </h2>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} style={{ 
          fontSize: '1rem', 
          fontWeight: 'bold', 
          margin: '0.8rem 0 0.3rem 0',
          color: '#555'
        }}>
          {line.replace('### ', '')}
        </h3>
      );
    }
    // Bold text
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <div key={index} style={{ 
          fontWeight: 'bold', 
          margin: '0.5rem 0',
          color: '#333'
        }}>
          {line.replace(/\*\*/g, '')}
        </div>
      );
    }
    // Bullet points
    if (line.startsWith('• ')) {
      return (
        <div key={index} style={{ 
          margin: '0.3rem 0', 
          paddingLeft: '1rem',
          position: 'relative'
        }}>
          <span style={{ 
            position: 'absolute', 
            left: '0', 
            color: '#667eea',
            fontWeight: 'bold'
          }}>•</span>
          <span>{line.replace('• ', '')}</span>
        </div>
      );
    }
    // Regular lines
    if (line.trim()) {
      return (
        <div key={index} style={{ margin: '0.3rem 0' }}>
          {line}
        </div>
      );
    }
    // Empty lines
    return <div key={index} style={{ height: '0.5rem' }} />;
  });

  return <div>{processedLines}</div>;
};

const ChatContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px 20px 0 0;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const LanguageSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatArea = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0 0 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: none;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
`;

const Message = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  ${props => props.isUser && 'flex-direction: row-reverse;'}
`;

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#28a745'};
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.6;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const InputArea = styled.div`
  padding: 2rem;
  border-top: 1px solid #e9ecef;
  background: rgba(248, 249, 250, 0.8);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  transition: border-color 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #6c757d;
  font-style: italic;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay}s;

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #495057;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'te', label: 'Telugu' },
    { value: 'mr', label: 'Marathi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'pa', label: 'Punjabi' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/chat', {
        message: inputMessage,
        language: selectedLanguage
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportChat = async () => {
    try {
      const response = await axios.get('/export-data');
      const { excel_data, filename } = response.data;
      
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel_data}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Chat history exported successfully!');
    } catch (error) {
      console.error('Error exporting chat:', error);
      toast.error('Failed to export chat history');
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      toast.success('Chat history cleared');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ChatContainer>
      <Container>
        <Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            <FaRobot />
            HealthBot Assistant
          </Title>
          <Controls>
            <LanguageSelect
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </LanguageSelect>
            <ActionButton onClick={handleExportChat}>
              <FaDownload />
              Export
            </ActionButton>
            <ActionButton onClick={handleClearChat} style={{ background: '#dc3545' }}>
              <FaTrash />
              Clear
            </ActionButton>
          </Controls>
        </Header>

        <ChatArea>
          <MessagesContainer>
            <AnimatePresence>
              {messages.length === 0 ? (
                <EmptyState
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <EmptyIcon>
                    <FaRobot />
                  </EmptyIcon>
                  <EmptyTitle>Welcome to HealthBot!</EmptyTitle>
                  <EmptyDescription>
                    I'm your AI health assistant. Ask me about symptoms, diseases, 
                    prevention tips, vaccination schedules, or any health-related questions. 
                    I'm here to help you stay healthy and informed.
                  </EmptyDescription>
                </EmptyState>
              ) : (
                messages.map((message) => (
                  <Message
                    key={message.id}
                    isUser={message.isUser}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MessageAvatar isUser={message.isUser}>
                      {message.isUser ? <FaUser /> : <FaRobot />}
                    </MessageAvatar>
                    <MessageContent isUser={message.isUser}>
                      <MessageRenderer text={message.text} isUser={message.isUser} />
                      <MessageTime isUser={message.isUser}>
                        {formatTime(message.timestamp)}
                      </MessageTime>
                    </MessageContent>
                  </Message>
                ))
              )}
            </AnimatePresence>

            {isLoading && (
              <LoadingMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MessageAvatar>
                  <FaRobot />
                </MessageAvatar>
                <div>
                  <TypingIndicator>
                    <span>HealthBot is typing</span>
                    <Dot delay={0} />
                    <Dot delay={0.2} />
                    <Dot delay={0.4} />
                  </TypingIndicator>
                </div>
              </LoadingMessage>
            )}

            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputArea>
            <InputContainer>
              <MessageInput
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your health concerns..."
                disabled={isLoading}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <FaPaperPlane />
              </SendButton>
            </InputContainer>
          </InputArea>
        </ChatArea>
      </Container>
    </ChatContainer>
  );
};

export default Chat;
