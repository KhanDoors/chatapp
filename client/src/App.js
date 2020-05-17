import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    let connect = io.connect("/");

    connect.on("your id", (id) => {
      setYourID(id);
    });

    connect.on("message", (message) => {
      console.log("here");
      setMessages((prevMsgs) => [...prevMsgs, message]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    let connect = io.connect("/");
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");
    connect.emit("send message", messageObject);
  };

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      <div>
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div key={index}>
                <p>{message.body}</p>
              </div>
            );
          }
          return (
            <div key={index}>
              <p>{message.body}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={handleChange}
          placeholder="Say something..."
        />
        <button>Send</button>
      </form>
    </>
  );
};

export default App;
