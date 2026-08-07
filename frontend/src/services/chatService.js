import api from "./api";

export const chatService = {

  // Chat CRUD

  createChat: async (title = "New Chat") => {
    const response = await api.post("/chats", { title });
    return response.data;
  },

  getChats: async () => {
    const response = await api.get("/chats");
    return response.data;
  },

  getChat: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  deleteChat: async (chatId) => {
    await api.delete(`/chats/${chatId}`);
  },

  // Messages

  getMessages: async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  saveMessage: async (chatId, role, content) => {
    const response = await api.post(`/chats/${chatId}/messages`, {
      role,
      content,
    });

    return response.data;
  },

  // AI (RAG)

  askAI: async (question) => {
    const response = await api.post("/ai/chat", {
      question,
    });

    return response.data;
  },

  updateChat: async (chatId, title) => {
    const response = await api.put(`/chats/${chatId}`, { title });
    return response.data;
  },
};