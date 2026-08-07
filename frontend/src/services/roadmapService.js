import api from './api'

export const roadmapService = {

    generateRoadmap: async (targetRole, currentSkills) => {
        const response = await api.post(
            '/roadmap-ai/generate',
            {
                targetRole,
                currentSkills
            }
        )

        return response.data
    },

    getRoadmaps: async () => {
        const response = await api.get('/roadmaps')
        return response.data
    },

    getRoadmap: async (id) => {
        const response = await api.get(`/roadmaps/${id}`)
        return response.data
    },

    markStepCompleted: async (roadmapId, stepId) => {
        const response = await api.put(
            `/roadmaps/${roadmapId}/steps/${stepId}/complete`
        )

        return response.data
    },

    deleteRoadmap: async (id) => {
        await api.delete(`/roadmaps/${id}`)
    }

}