import React, { useEffect, useState } from 'react'
import useAuth from './UseAuth'
import Graph from './Graph.js'


var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

//Presents the code to the page
export default function Dashboard({code}){
    const [userId, setUserId] = useState();
    const [playlists, setPlaylists] = useState([]);
    const [search, setSearch] = useState("");
    const [listName, setListName] = useState("");
    const [graphData, setGraphData] = useState([]);
    const access_token = useAuth(code) //Calls the useAuth function with the code --> UseAuth.js -- Returns the access token


    function handleClick() {
        setListName(search)
    }


    useEffect(() => {
        spotifyApi.setAccessToken(access_token);
    }, [access_token])
    
    useEffect(() => {
        if(!access_token) return
        spotifyApi.getMe().then( (data) => {
            setUserId(data.display_name);
        })
    }, [access_token])
    
    useEffect(() => {
        if(!userId) return
        
        spotifyApi.getUserPlaylists(userId, {limit: 50}).then( (data) => {
            return data.items
        }).then((prevList) => {
            spotifyApi.getUserPlaylists(userId, {limit: 50, offset: 49}).then( (data) => {
                setPlaylists(prevList.concat(data.items));      
            })    
        })
    }, [userId, access_token])

    useEffect( () => {

        if(!listName || !access_token) return;
        const listId = playlists.find(x =>x.name === listName)
        if(!listId) return console.log("notFound")
        var i;
        spotifyApi.getPlaylistTracks(listId.id).then( (data) => {
            const numOfDec = 8;
            var amount_arr = new Array(numOfDec).fill(0);
            
            data.items.forEach(x => {
                const year = x.track.album.release_date ? Number(x.track.album.release_date.split("-")[0]) : null;

                if(!year) return;
                if(year<1960) { amount_arr[0] += 1;}
                if(year>=1960 && year <1970){amount_arr[1] += 1;}
                if(year>=1970 && year <1980){amount_arr[2] += 1}
                if(year>=1980 && year <1990){amount_arr[3] += 1}
                if(year>=1990 && year <2000){amount_arr[4] += 1}
                if(year>=2000 && year <2010){amount_arr[5] += 1}
                if(year>=2010 && year <2020){amount_arr[6] += 1}
                if(year>=2020) {amount_arr[7] += 1}
            })

            var data_arr = []
            for(i = 0; i<numOfDec; i++ ){
                var year = 1950+i*10
                data_arr.push({
                    name: year.toString(),
                    Amount: amount_arr[i]
                })
            }
            setGraphData(data_arr);
        })
    }, [access_token, listName, playlists])
    
    
    return (
        <div id="wrapper">
            <div id="input_container">            
                <div id="title">Playlist Name</div>
                <input id="input_box" type="text" onChange={e => setSearch(e.target.value)}/>
                <button type="submit" id="submit" onClick={handleClick}>Submit</button> 
            </div>
    
            <div id="graph_container">
                <Graph data={graphData} />
            </div>
        </div>
    )
}


