import React from 'react';
import { Container } from "react-bootstrap";
//Spotify api authentication link form the documentation with the correct parameters portraited.
const AUTH = "https://accounts.spotify.com/authorize?client_id=d0bf284827dc4a7ea370c45262bbc363&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-email%20playlist-read-private%20playlist-read-collaborative";

//The button redirects the user to the spotify api login page which returns the needen paramter "code" in the url. 
//We can see that the parameter redirect_uri has the value of http://localhost:3000 where the user is redirect.
export default function Login() {
    return (
        <Container>
            <div class="position-absolute top-50 start-50 translate-middle">
                <a className="btn btn-succsess btn-lg" href={AUTH}>
                    <button type="button" class="btn btn-success">Login</button>
                </a>
            </div>  
        </Container>
    )
}
