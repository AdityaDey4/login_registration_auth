import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = ()=> {

    const effectRan = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth, persist} = useAuth();

    useEffect(()=> {

        let isMounted = true;
        if(effectRan.current === true || process.env.NODE_ENV !== 'development') {

            const verifyRefreshToken = async ()=> {

                try {
                    await refresh();
                }
                catch(err) {
                    console.error(err);
                }
                finally {
                    isMounted && setIsLoading(false);
                }
            }
            console.log(auth);
            !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
        }

        return ()=> {
            effectRan.current = true;
            isMounted = false;
        }
    }, []);

    useEffect(()=> {

        if(effectRan.current === true || process.env.NODE_ENV !== 'development') {
            console.log("isLoading : "+isLoading);
            console.log("aT : "+JSON.stringify(auth?.accessToken));
        }
    }, [isLoading]);

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading......</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;