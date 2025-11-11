import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { setting } from '../config/config';

const axiosInstance= axios.create({
    baseURL: setting.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});


//Request interceptors
axios.interceptors.request.use(
    (config) => config,
    (error: AxiosError) => Promise.reject(new Error(error.message || "Something went wrong"))
)

//Response interceptors
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError)=>{
        const excludeRoute: string[] = []

        const REDIRECT_STATUS_CODES= [400, 403, 429]
        if(
            error.response &&
            REDIRECT_STATUS_CODES.includes(error.response.status) &&
            !excludeRoute.includes(error?.config?.url || " ")
        ){
            console.log(error.config?.url);

            window.location.href= "/login";
            
        }
        return Promise.reject(error);
    }
);

export interface CustomAxiosResponse<T> extends AxiosResponse<T>{
    error?: string;
    message?: string;
}

export const _get = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<CustomAxiosResponse<T>> => {
    const response = await axiosInstance.get(url, config);
    return response;
}

export const _post = async <T>(url: string, data: string, config?: InternalAxiosRequestConfig): Promise<CustomAxiosResponse<T>> => {
    const response = await axiosInstance.post(url, data, config);
    return response;
}

export const _put = async <T>(url: string, data: string, config?: InternalAxiosRequestConfig): Promise<CustomAxiosResponse<T>> => {
    const response = await axiosInstance.put(url, data, config);
    return response;
}

export const _delete = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<CustomAxiosResponse<T>> => {
    const response = await axiosInstance.delete(url, config);
    return response;
}