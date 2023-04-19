import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {

    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const effectRan = useRef(false);

    useEffect(()=> {
       
        let isMounted = true;
        const controller = new AbortController();
        if(effectRan.current === true || process.env.NODE_ENV !== 'development') {
    
            const getUsers = async ()=> {
                try {
                    const response = await axiosPrivate.get('/users', {
                        signal : controller.signal // this is allowed us to cancle the request if we need to
                    });
    
                    console.log(response.data);
                    isMounted && setUsers(response.data);
                } catch(err) {
                    console.error(err);
                    navigate('/login', { state: { from: location }, replace: true });
                }
            }
    
            getUsers();
        }

        // clean up function runs when the component unmounted
        return ()=> {
            isMounted = false;
            controller.abort();
            effectRan.current = true;
        }
        // eslint-disable-next-line
    }, []);

  return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i)=> <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No Users to display</p>
            }
        </article>
  )
}

export default Users