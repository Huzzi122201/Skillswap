import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatPage.css';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { FaPaperclip, FaSearch, FaEdit, FaPhone, FaVideo, FaInfoCircle, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      chatService.markAsRead(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (!message.trim() || !selectedChat) return;

    try {
      const newMessage = await chatService.sendMessage(selectedChat._id, message);
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      const fullChat = await chatService.getChatById(chat._id);
      setSelectedChat(fullChat);
    } catch (err) {
      console.error('Error loading chat:', err);
      setError('Failed to load chat messages');
    }
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await response.json();
      setSearchResults(data.users);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartNewChat = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const newChat = await response.json();
      
      // Add the new chat to the list and select it
      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
      setShowNewChatModal(false);
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== currentUser._id);
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-spinner">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Contacts Sidebar */}
        <div className="contacts-sidebar">
          <div className="contacts-header">
            <h2>Messages</h2>
            <button 
              className="new-chat-btn"
              onClick={() => setShowNewChatModal(true)}
            >
              <FaEdit />
              New Chat
            </button>
          </div>
          <div className="contacts-search">
            <FaSearch />
            <input type="text" placeholder="Search messages..." />
          </div>
          <div className="contacts-list">
            {chats.map(chat => {
              const otherParticipant = getOtherParticipant(chat);
              return (
                <div
                  key={chat._id}
                  className={`contact-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="contact-avatar">
                    <img src={otherParticipant.avatar} alt={otherParticipant.name} />
                    <span className="online-indicator"></span>
                  </div>
                  <div className="contact-info">
                    <div className="contact-header">
                      <h3>{otherParticipant.name}</h3>
                      <span className="time">
                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="last-message">
                      {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">{chat.unreadCount}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedChat ? (
            <div className="chat-area">
              <div className="chat-header">
                <div className="chat-contact-info">
                  <img 
                    src={getOtherParticipant(selectedChat).avatar} 
                    alt={getOtherParticipant(selectedChat).name} 
                  />
                  <div>
                    <h3>{getOtherParticipant(selectedChat).name}</h3>
                  </div>
                </div>
                <div className="chat-actions">
                  <button><FaPhone /></button>
                  <button><FaVideo /></button>
                  <button><FaInfoCircle /></button>
                </div>
              </div>
              <div className="chat-messages">
                {selectedChat.messages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`message ${msg.sender._id === currentUser._id ? 'message-sent' : 'message-received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-container">
                <button className="attachment-btn">
                  <FaPaperclip />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          ) : (
            <div className="no-chat-selected">
              <i className="bx bx-message-square-dots"></i>
              <h3>Select a conversation</h3>
              <p>Choose from your existing conversations or start a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Chat</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewChatModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="search-container">
              <div className="search-input">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchUsers(e.target.value);
                  }}
                />
              </div>
              <div className="search-results">
                {searchLoading ? (
                  <div className="search-loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div 
                      key={user._id}
                      className="user-result"
                      onClick={() => handleStartNewChat(user._id)}
                    >
                      <img src={user.avatar} alt={user.name} />
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="no-results">No users found</div>
                ) : (
                  <div className="search-prompt">
                    Start typing to search for users
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 