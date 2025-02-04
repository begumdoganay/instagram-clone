// messages.js
class MessagesComponent {
    constructor() {
        this.conversations = new Map();
        this.activeChat = null;
        this.initializeMessages();
    }
 
    initializeMessages() {
        this.setupChatList();
        this.setupMessageInput();
        this.setupRealTimeUpdates();
    }
 
    setupChatList() {
        document.querySelectorAll('.chat-item').forEach(chat => {
            chat.addEventListener('click', () => this.openChat(chat.dataset.userId));
        });
    }
 
    openChat(userId) {
        if (this.activeChat === userId) return;
        
        this.activeChat = userId;
        this.loadChatHistory(userId);
        
        const chatWindow = document.querySelector('.chat-window');
        chatWindow.classList.add('active');
    }
 
    async loadChatHistory(userId) {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML = '';
 
        try {
            const messages = await this.fetchMessages(userId);
            messages.forEach(msg => this.renderMessage(msg));
            this.scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
 
    renderMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.isSent ? 'sent' : 'received'}`;
        messageEl.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${this.formatTime(message.timestamp)}</div>
            ${message.isSent ? this.getMessageStatus(message.status) : ''}
        `;
        
        document.querySelector('.chat-messages').appendChild(messageEl);
    }
 
    setupMessageInput() {
        const form = document.querySelector('.message-form');
        const input = form.querySelector('input');
 
        form.addEventListener('submit', e => {
            e.preventDefault();
            const text = input.value.trim();
            if (text && this.activeChat) {
                this.sendMessage(text);
                input.value = '';
            }
        });
 
        // Typing indicator
        let typingTimeout;
        input.addEventListener('input', () => {
            if (!typingTimeout) {
                this.sendTypingStatus(true);
            }
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                this.sendTypingStatus(false);
                typingTimeout = null;
            }, 1000);
        });
    }
 
    async sendMessage(text) {
        const message = {
            id: Date.now(),
            text,
            timestamp: new Date(),
            isSent: true,
            status: 'sending'
        };
 
        this.renderMessage(message);
        this.scrollToBottom();
 
        try {
            await this.sendMessageToServer(message);
            this.updateMessageStatus(message.id, 'sent');
        } catch (error) {
            this.updateMessageStatus(message.id, 'failed');
            console.error('Error sending message:', error);
        }
    }
 
    setupRealTimeUpdates() {
        // WebSocket connection setup would go here
        this.socket = new WebSocket('ws://your-websocket-server');
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'message':
                    this.handleNewMessage(data.message);
                    break;
                case 'typing':
                    this.handleTypingStatus(data.userId, data.isTyping);
                    break;
                case 'status':
                    this.handleStatusUpdate(data.messageId, data.status);
                    break;
            }
        };
    }
 
    handleNewMessage(message) {
        if (message.userId === this.activeChat) {
            this.renderMessage(message);
            this.scrollToBottom();
        } else {
            this.showNotification(message);
        }
    }
 
    handleTypingStatus(userId, isTyping) {
        if (userId === this.activeChat) {
            const typingIndicator = document.querySelector('.typing-indicator');
            typingIndicator.classList.toggle('active', isTyping);
        }
    }
 
    scrollToBottom() {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
 
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
 
    getMessageStatus(status) {
        const icons = {
            sending: '<i class="fas fa-clock"></i>',
            sent: '<i class="fas fa-check"></i>',
            delivered: '<i class="fas fa-check-double"></i>',
            read: '<i class="fas fa-check-double read"></i>',
            failed: '<i class="fas fa-exclamation-circle"></i>'
        };
        return `<div class="message-status">${icons[status]}</div>`;
    }
 }