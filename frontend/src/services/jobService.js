import api from './api'

export const jobService = {

  getAll: async () => {
    const response = await api.get('/jobs')
    return response.data
    // returns: [{ id, company, role, status, date, link }]
  },

  add: async (job) => {
    const response = await api.post('/jobs', job)
    return response.data
    // returns: { id, company, role, status, date, link }
  },

  update: async (job) => {
    const response = await api.put(`/jobs/${job.id}`, job);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}`)
    return response.data
  },

}