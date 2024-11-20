// src/components/Chat.js
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { db } from "../../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

  // Fetch messages in real-time from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(messagesData);
    });
    return unsubscribe;
  }, []);

  // Send new message to Firestore
  const handleSendMessage = async () => {
    if (newMessage.trim() && username.trim()) {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        username,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: 4,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
      component={Paper}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Live Chat
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: 1,
          mb: 2,
          p: 1,
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{message.username.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={message.username}
                secondary={message.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Type your message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Box>
  );
};

export default Chat;
