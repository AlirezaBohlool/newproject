'use client';

import { useState } from 'react';
import UserProfile from './UserProfile';
import AuthStatus from './AuthStatus';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

interface ChatInterfaceProps {
  onViewChange: (view: 'chat' | 'packages') => void;
}

export default function ChatInterface({ onViewChange }: ChatInterfaceProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'چگونه از API استفاده کنم؟',
      date: '2024-01-15',
      messages: [
        { id: '1', content: 'سلام! چطور می‌تونم کمکتون کنم؟', isUser: true, timestamp: new Date() },
        { id: '2', content: 'سلام! خوشحالم که می‌تونم کمکتون کنم. لطفاً سوالتون رو بپرسید.', isUser: false, timestamp: new Date() },
      ]
    },
    {
      id: '2',
      title: 'مشکل در اتصال به دیتابیس',
      date: '2024-01-14',
      messages: []
    },
    {
      id: '3',
      title: 'بهینه‌سازی عملکرد',
      date: '2024-01-13',
      messages: []
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const chat = chatHistory.find(c => c.id === selectedChat);
    if (!chat) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: 'متشکرم از پیام شما. من در حال پردازش درخواست شما هستم.',
      isUser: false,
      timestamp: new Date()
    };

    const updatedHistory = chatHistory.map(c => 
      c.id === selectedChat 
        ? { ...c, messages: [...c.messages, userMessage, botMessage] }
        : c
    );

    setChatHistory(updatedHistory);
    setNewMessage('');
  };

  const startNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'چت جدید',
      date: new Date().toISOString().split('T')[0],
      messages: []
    };
    setChatHistory([newChat, ...chatHistory]);
    setSelectedChat(newChat.id);
  };

  const currentChat = chatHistory.find(c => c.id === selectedChat);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <div className="w-80 bg-[var(--card-bg)] border-r border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">ChatBot</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">دستیار هوشمند شما</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)]">
          <button className="flex-1 py-3 px-4 text-sm font-medium text-[var(--primary)] border-b-2 border-[var(--primary)] bg-[var(--primary-light)] bg-opacity-10">
            چت
          </button>
          <button 
            onClick={() => onViewChange('packages')}
            className="flex-1 py-3 px-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--secondary)]"
          >
            پکیج
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">تاریخچه چت</h3>
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat === chat.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'hover:bg-[var(--secondary)] text-[var(--text-primary)]'
                }`}
              >
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className={`text-xs ${selectedChat === chat.id ? 'text-white opacity-80' : 'text-[var(--text-muted)]'}`}>
                  {chat.date}
                </div>
              </div>
            ))}
          </div>

          {/* New Chat Button */}
          <button 
            onClick={startNewChat}
            className="w-full py-3 px-4 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium"
          >
            چت جدید
          </button>
        </div>

        {/* User Profile */}
        <UserProfile />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {currentChat ? currentChat.title : 'خوش آمدید به ChatBot'}
            </h2>
            <AuthStatus />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {currentChat ? 'آماده پاسخگویی به سوالات شما هستم' : 'برای شروع چت، یک گفتگو انتخاب کنید یا چت جدیدی شروع کنید'}
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">شروع کنید</h3>
              <p className="text-[var(--text-secondary)] mb-6">برای شروع گفتگو، یک چت انتخاب کنید یا چت جدیدی ایجاد کنید</p>
              <button 
                onClick={startNewChat}
                className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium"
              >
                شروع چت جدید
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentChat.messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-xs ${
                    message.isUser 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-[var(--secondary)] text-[var(--text-primary)]'
                  }`}>
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      message.isUser ? 'text-white opacity-80' : 'text-[var(--text-muted)]'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--card-bg)]">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 p-3 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-1 focus:ring-[var(--input-focus)]"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !selectedChat}
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ارسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
