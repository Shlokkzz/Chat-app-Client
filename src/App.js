import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "http://localhost:3001";

function App() {
  // Before Login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    return () => {
      socket.disconnect();
    };
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  // scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // socket ops
  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };
    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  return (
    <div className="App">
      <div className="title">
        {!loggedIn ? <h1>Welcome to the Chat room!</h1> : <h1>Room: {room}</h1>}
      </div>
      <div className="lowerSection">
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
          <div className="chatContainer">
            <div className="messages">
              {messageList.map((val, key) => {
                return (
                  <div
                    className="messageContainer"
                    id={val.author === userName ? "Self" : "Other"}
                  >
                    <div className="messageIndividual">
                      <p>
                        {val.author}: {val.message}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="messageInputs">
              <TextField
                id="filled-basic"
                label="Message"
                variant="filled"
                onChange={(e) => setMessage(e.target.value)}
                style={{ height: "50px", width: "80%", marginBottom: "5px" }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                style={{
                  height: "55px",
                  width: "20%",
                  backgroundColor: "rgb(195, 47, 232)",
                }}
                onClick={sendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
