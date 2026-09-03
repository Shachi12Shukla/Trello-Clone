import axios from 'axios'

const backend_base_url = import.meta.env.VITE_BASE_URL;

const axiosAPI = axios.create({
    baseURL: backend_base_url,
    timeout: 2000,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosAPI.interceptors.request.use( (config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.token = token;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
} )

export default axiosAPI;

