// frontend/src/App.js

import React, { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editMode, setEditMode] = useState(null); // ID of the message to be edited
  const [editText, setEditText] = useState(""); // Text for editing the message

  // Fetch existing messages from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // Handle form submission to post a new message
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newMessage }),
    })
      .then((res) => res.json())
      .then((message) => setMessages([...messages, message]));

    setNewMessage("");
  };

  // Handle deleting a message
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/message/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((deletedMessage) => {
        setMessages(messages.filter((message) => message._id !== id));
      });
  };

  // Handle starting the edit mode
  const handleEdit = (id, text) => {
    setEditMode(id);
    setEditText(text);
  };

  // Handle updating a message
  const handleUpdate = (id) => {
    fetch(`http://localhost:5000/api/message/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    })
      .then((res) => res.json())
      .then((updatedMessage) => {
        setMessages(
          messages.map((msg) => (msg._id === id ? updatedMessage.updatedMessage : msg))
        );
        setEditMode(null); // Exit edit mode after update
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Messages to and from the Backend</h1>
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              {editMode === msg._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ marginRight: "10px" }}
                  />
                  <button onClick={() => handleUpdate(msg._id)}>Update</button>
                  <button onClick={() => setEditMode(null)} style={{ marginLeft: "10px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {msg.text}
                  <button onClick={() => handleEdit(msg._id, msg.text)} style={{ marginLeft: "10px" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(msg._id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="New message"
          />
          <button type="submit">Send to the backend</button>
        </form>
      </header>
    </div>
  );
}

export default App;
