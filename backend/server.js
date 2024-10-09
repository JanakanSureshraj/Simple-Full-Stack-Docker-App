// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const MONGO_URI = "mongodb://mongo:27017/docker-tutorial";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define the message schema and model
const messageSchema = new mongoose.Schema({
  text: String,
});

const Message = mongoose.model("Message", messageSchema);

// Route to get all messages
app.get("/api/message", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Route to add a new message
app.post("/api/message", async (req, res) => {
  try {
    const newMessage = new Message({ text: req.body.text });
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error saving message" });
  }
});

// Route to delete a message by ID
app.delete("/api/message/:id", async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted", deletedMessage });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" });
  }
});

// Route to update a message by ID
app.put("/api/message/:id", async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true } // Return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message updated", updatedMessage });
  } catch (error) {
    res.status(500).json({ message: "Error updating message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
