import api from "./api";

export const resumeService = {

    uploadResume: async(file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            "/resume-ai/upload",
            formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        );

        return response.data;
    },

    analyzeResume: async(resumeId)=>{
        const response = await api.get(`/resume-ai/analyze/${resumeId}`);
        return response.data;
    },

    getAllResumes: async()=>{
        const response = await api.get("/resumes");
        return response.data;
    }

}