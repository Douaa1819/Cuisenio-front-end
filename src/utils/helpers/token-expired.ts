import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

export const tokenExpired = (error: AxiosError, navigate: NavigateFunction) => {
    if (error instanceof AxiosError && error.response) { 
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

    
    return Promise.reject(error);
}







