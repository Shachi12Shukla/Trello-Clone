import axiosAPI from "../utils/AxiosInstance"

export const getIssues = async (boardId) => {
    const response = await axiosAPI.get(`/issues/${boardId}`);
    return response.data;
}

export const createIssue = async (boardId, title, state) => {
    const response = await axiosAPI.post('/issue', {boardId, title, state});
    return response.data;
}

export const updateIssueState = async (boardId, issueId, beforeState, afterState) => {
    const response = await axiosAPI.put('/issue', {boardId, issueId, beforeState, afterState});
    return response.data;
}

export const updateIssueTitle = async (boardId,issueId,title) => {

    const response =  await axiosAPI.patch(`/issue/${issueId}`, {boardId,title});

    return response.data;
};