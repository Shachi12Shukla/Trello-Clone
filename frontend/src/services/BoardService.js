import axiosAPI from "../utils/AxiosInstance"

export const createBoard = async (workspaceId, title) => {
    const response = await axiosAPI.post("/board", {workspaceId, title});
    return response.data;
}

export const getBoards = async (workspaceId) => {
    const response = await axiosAPI.get(`/boards/${workspaceId}`);
    return response.data;
}
