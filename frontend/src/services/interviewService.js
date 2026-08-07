import api from "./api";

export const interviewService = {

  generateInterview: async (jobRole, difficulty) => {
    const response = await api.post("/interview-ai/generate", {
      jobRole,
      difficulty,
    });
    return response.data;
  },

  evaluateAnswer: async (sessionId, questionId, answer) => {
    const response = await api.post(
      `/interview-ai/${sessionId}/evaluate/${questionId}`,
      { answer }
    );
    return response.data;
  },

  finalizeInterview: async (sessionId) => {
    const response = await api.post(
      `/interview-ai/${sessionId}/finalize`
    );
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/interviews");
    return response.data;
  },

  getSession: async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  deleteSession: async (id) => {
    await api.delete(`/interviews/${id}`);
  },

};