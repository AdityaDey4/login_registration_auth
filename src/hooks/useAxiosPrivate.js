import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = ()=> {
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(()=> {

        const requestIntercerpt = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) { // first attempt, not retry
                    console.log("first attempt, not retry");
                    config.headers['Authorization'] = "Bearer "+auth?.accessToken;
                }
                
                return config;
            },
            (error)=> Promise.reject(error)
        )

        const responseIntercerpt = axiosPrivate.interceptors.response.use(
            response=> response,
            async (error)=> { // if there is any error, line expiary if AccessToken
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent) {

                    console.log("if there is any error, line expiary if AccessToken");
                    console.log(prevRequest);
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = "Bearer "+newAccessToken;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        )

        return ()=> {
            axiosPrivate.interceptors.request.eject(requestIntercerpt);
            axiosPrivate.interceptors.response.eject(responseIntercerpt);
        }

    }, [auth, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;
