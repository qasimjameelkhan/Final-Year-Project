import { create } from "zustand";

export const useChatStore = create((set) => ({
  chats: [],
  messages: [],
  selectedChatId: null,
  selectedChatProfiles: null,
  userStatuses: {},
  currentUserId: null,
  hasUnreadMessages: false,
  setChats: (chats) => set({ chats }),
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  addMessage: (message) =>
    set((state) => {
      const existingIds = new Set(state.messages.map((msg) => msg.id));
      let messages;
      if (existingIds.has(message.id)) {
        messages = state.messages.map((msg) =>
          msg.id === message.id ? message : msg
        );
      } else {
        messages = [...state.messages, message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return { messages };
    }),
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
  setSelectedChatProfiles: (profiles) =>
    set({ selectedChatProfiles: profiles }),
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
  setHasUnreadMessages: (hasUnread) => set({ hasUnreadMessages: hasUnread }),
  updateUserStatus: (userId, status) =>
    set((state) => ({
      userStatuses: { ...state.userStatuses, [userId]: status },
    })),
  updateMessageStatus: (messageId, status, userId) =>
    set((state) => {
      if (!userId) return state;
      if (!state.currentUserId) {
        state.currentUserId = userId;
      }
      const messages = state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, viewed: status } : msg
      );
      const chats = state.chats.map((chat) => {
        if (chat.latestMessage?.id === messageId) {
          chat.latestMessage.viewed = status;
        }
        const unviewedCount = messages.filter(
          (msg) =>
            msg.chatId === chat.id &&
            msg.receiverId === userId &&
            msg.viewed !== "VIEWED"
        ).length;
        return { ...chat, unviewedCount };
      });
      return { messages, chats };
    }),
  setChat: (chatId, updates) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    })),
  clearMessages: () => set({ messages: [], hasUnreadMessages: false }),
  clearChats: () => set({ chats: [], hasUnreadMessages: false }),
}));
