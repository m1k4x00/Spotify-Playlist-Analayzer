import {useState, useEffect} from 'react'
import axios from 'axios'

export default function useAuth(code){
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    //If the state of the code variable changes then we make the api call to /login and parse the response to the corresponding variables e.g accessToken.
    //If an error occurs we redirect the user to the root page '/'.
    useEffect(() => {
        axios.post('http://localhost:3001/login', {code,}).then(res => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);

            window.history.pushState({}, null, "/"); //Clears the search bar of the code
        }).catch(() => {
            window.location = '/';
        })
    }, [code])

    //Excecutes if the states of the refreshToken or expiresIn variables change
    //Uses setTimeout to make the post call to the refresh api only when there is 60 secs left. If the sometihng goes wrong we clear the timeout
    //Returns the access token which is used to call the spotify api;
    useEffect(()=> {
        if(!refreshToken || !expiresIn) return; //Checks that the variables aren't null
        const timeout = setTimeout(() => {

            axios.post('http://localhost:3001/refresh', {refreshToken,}).then(res => {
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            }).catch(() => {
                window.location = '/';
            })
        }, (expiresIn - 60) * 1000)
        
        return () => clearTimeout(timeout)

    }, [refreshToken, expiresIn])

    return accessToken;
}