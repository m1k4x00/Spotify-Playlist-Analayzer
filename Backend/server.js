const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');

const app = express();
//Middleware
app.use(cors());
app.use(express.json());

//Api used to refresh the access token.
//Requests the refreshtoken from the caller and updates the refreshAccessToken using the new spotifyApi instance created with the refresh token 
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'd0bf284827dc4a7ea370c45262bbc363',
        clientSecret: '54b314679f66450999756bd7efe5d7e3',
        refreshToken
    });

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
          
        }).catch(() => {
            res.sendStatus(400);
        })

})
//Api used to authorize the user on login
//Uses the new instance of spotify api to authorize the user. Requests the code from the spotify authorization link response and makes a authorizationCodeGrant call to the spotify api with the code.
//Responds the access token, refresh token and expires in time witch are saved in UseAuth.js
app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'd0bf284827dc4a7ea370c45262bbc363',
        clientSecret: '54b314679f66450999756bd7efe5d7e3'
    });

    spotifyApi.authorizationCodeGrant(code).then(data =>{
      res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in
        })
      }).catch(() => {
            res.sendStatus(400);
    })
})

app.listen(3001);
