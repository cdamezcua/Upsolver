import React, { useContext, useEffect } from "react";
import "./ChatDialog.css";
import { Box } from "@mui/material";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { UserContext } from "../../UserContext";
import { socket } from "../../socket";
import MessageBox from "../MessageBox/MessageBox";
export default function ChatDialog({
  isChatOpen,
  setIsChatOpen,
  activeContestProblem,
  setActiveContestProblem,
}) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const chatContainerRef = React.useRef(null);
  const handleChatClose = () => {
    setIsChatOpen(false);
    setActiveContestProblem({});
    setMessages([]);
  };

  useEffect(() => {
    if (activeContestProblem.problemId !== undefined) {
      socket.on("join_error", (error) => {
        console.log("join_error: ", error);
      });
      socket.emit("join", {
        id: activeContestProblem.problemId,
      });
      socket.on("message", (message) => {
        console.log("message: ", message);
        setMessages((messages) => [...messages, message]);
      });
      return () => {
        socket.off("join_error");
        socket.off("message");
        socket.emit("leave", {
          id: activeContestProblem.problemId,
        });
      };
    }
  }, [activeContestProblem]);

  const handleSendMessage = () => {
    socket.emit("message", {
      content: newMessage,
      sender: user.username,
      senderRank: user.rank,
      roomId: activeContestProblem.problemId,
    });
    setNewMessage("");
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        const chatContainer = chatContainerRef.current;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages]);

  return (
    <Dialog open={isChatOpen} onClose={handleChatClose} fullWidth maxWidth="lg">
      <DialogTitle>{activeContestProblem.problemName}</DialogTitle>
      <DialogContent
        dividers
        sx={{ height: "500px" }}
        scroll="paper"
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <MessageBox key={index} message={message} />
        ))}
      </DialogContent>
      <Box sx={{ m: "20px" }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (newMessage.trim() !== "") {
              handleSendMessage();
            }
          }}
        >
          <Stack direction="row">
            <TextField
              label="Message"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Send
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
}
