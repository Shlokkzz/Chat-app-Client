import React, { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "http://localhost:3001";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [room, setRoom] = useState("");   
  const [userName, setUserName] = useState("");

  useEffect(() => {
    socket = io(CONNECTION_PORT,{
      withCredentials:true
    });
    socket.on('connect', () => {
      console.log('Connected to socket.io server');
  });

  return () => {
      socket.disconnect();
  };
  }, [CONNECTION_PORT]);

  const connectToRoom = ()=>{
    socket.emit('join_room',room);
    console.log("Button Clicked");
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              style={{ margin: "0px 20px" }}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Room"
              variant="outlined"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <Button variant="contained" color="success" onClick={connectToRoom}>
            Enter Chat
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
