import axiosAPI from "../utils/AxiosInstance"

export const signupUser = async (credentials) => {
    const response = await axiosAPI.post("/signup", credentials);

    return response.data;
};

export const signinUser = async (credentials) => {
    const response = await axiosAPI.post("/signin", credentials);
    return response.data;
}