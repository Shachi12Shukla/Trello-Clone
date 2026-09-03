import axiosAPI from "../utils/AxiosInstance"

// get workspaces
export const getWorkspaces = async () => {
    const response = await axiosAPI.get("/workspaces");
    return response.data;
}

// create workspace

export const createWorkspace = async (workspaceData) => {  
    const response = await axiosAPI.post("/workspace", workspaceData);
    return response.data;   
}

// get workspace by ID
export const getWorkspaceById = async (workspaceId) => {
    const response = await axiosAPI.get(`/workspace?workspaceId=${workspaceId}`)
    return response.data;
}

// add member to workspace
export const addMemberToWorkspace = async (workspaceId, memberUsername) => {
    const response = await axiosAPI.post("/add-member-to-workspace", {workspaceId, memberUsername});
    return response.data;
}

// get members
export const getMembers = async (workspaceId) => {
    const response = await axiosAPI.get(`/members/${workspaceId}`)
    return response.data;
}

// remove members
export const removeMembers = async (workspaceId,
            memberUsername) => {
    const response = await axiosAPI.delete("/members", {
        data: {
            workspaceId,
            memberUsername
        }
    });
    return response.data;
}