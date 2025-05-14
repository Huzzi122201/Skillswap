import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import './ChatSystem.css';

const ChatSystem = ({ mode = 'direct', forumId }) => {
  const { currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChats();
      setChats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    try {
      const newMessage = await chatService.sendMessage(activeChat._id, message);
      setChats(prevChats => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(c => c._id === activeChat._id);
        if (chatIndex !== -1) {
          updatedChats[chatIndex].messages.push(newMessage);
        }
        return updatedChats;
      });
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    try {
      await chatService.markAsRead(chat._id);
      // Update unread status in chat list
      setChats(prevChats => {
        return prevChats.map(c => {
          if (c._id === chat._id) {
            return {
              ...c,
              messages: c.messages.map(m => ({ ...m, read: true }))
            };
          }
          return c;
        });
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const startNewChat = async (userId) => {
    try {
      const newChat = await chatService.createChat(userId);
      setChats(prevChats => [...prevChats, newChat]);
      setActiveChat(newChat);
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create chat');
    }
  };

  if (loading) {
    return <div className="loading">Loading chats...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="chat-system">
      <div className="chat-sidebar">
        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat._id}
              className={`chat-item ${activeChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="chat-item-avatar">
                {chat.participants[0].name.charAt(0)}
              </div>
              <div className="chat-item-info">
                <div className="chat-item-name">
                  {chat.participants.find(p => p._id !== currentUser._id)?.name}
                </div>
                <div className="chat-item-preview">
                  {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <h3>{activeChat.participants.find(p => p._id !== currentUser._id)?.name}</h3>
            </div>
            <div className="chat-messages">
              {activeChat.messages.map(msg => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === currentUser._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem; 