import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments, FaAngleLeft, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import io from 'socket.io-client';
import styles from "./style";
import { notify } from "../../utils";
import { selectUser } from "../../store/slice/user";
import UserActionModal from '../UserActionModal/index.jsx';
import {Toolbar,ListItem,ListItemText,Avatar,Divider, Menu, MenuItem, IconButton,Box, AppBar, List, Typography } from '@mui/material';
import ReactDOM from "react-dom"
import CloseIcon from '@mui/icons-material/Close'; // the close ❌ icon
const socket = io(process.env.REACT_APP_SOCKET_PATH);
const BASE_PATH = process.env.REACT_APP_BASE_PATH;

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown";
  
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // console.error("Invalid date:", timestamp);
      return "Invalid date";
    }
  
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    
  
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
  
    return date.toLocaleString(); // Fallback to full date
  };
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ChatComponent = ({ open, onClose }) => {
  const userActionRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPrivateChat, setPrivateChat] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [privateRoomId, setPrivateRoomId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const privateRoomIdRef = useRef(null);
  // const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sub, setSub] = useState(null);
  const [events, setEvents] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const user = useSelector(selectUser);
  const [systemSettings, setSystemSettings] = useState(null); 
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
const [openMenu, setOpenMenu] = useState(false);
const [selectedMsg, setSelectedMsg] = useState(null); // ⭐ New

  const handleOpenMenu = (event, msg) => {
    setAnchorEl(event.currentTarget);
    setSelectedMsg(msg); // ⭐ Save clicked user
    setOpenMenu(true);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMsg(null); // ⭐ Clear selected
    setOpenMenu(false);
  };
  const handleViewInfo = () => {
    console.log('View info of:', user);
    handleCloseMenu();
  };

  const handleStartPrivateChat = () => {
    // console.log('Start chat with:', user, event);
    handleCloseMenu();
  };

  // const openMenu = Boolean(anchorEl);
  const toggleChat = () => {
    chatOpen ? setChatOpen(false) : setChatOpen(true);
  }

  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("closing modal...");
    onClose()
  };
  const toggleExpand = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };
  
  useEffect(() => {
    if(user.id){
      setSelectedEvent(null);
      setSelectedChat(null);
      setPrivateChat(null);
      setSelectedUser(null);
      setMessages([]);
      privateRoomIdRef.current = null;
      socket.off("receiveMessage");
      socket.off("receivePrivateMessage");

      fetch("https://admin.o7events.com/api/system-settings") 
      .then((res) => res.json())
      .then((system) => 
        { 
          // console.log("response off system settings", system);
          setSystemSettings(system)
          fetch(BASE_URL+"/user-events?user_id="+user.id) 
          .then((res) => res.json())
          .then((data) => {
            // console.log(systemSettings, system)
            const disabledIds = system?.disabled_events?.map(event => event.event_id) || [];
            // console.log("disabledIds", disabledIds);
            const filteredEvents = data.filter(event => !disabledIds.includes(event.id));
            // console.log("filteredEvents", filteredEvents);
            setEvents(filteredEvents);
          }) 
          .catch((err) => console.error("Error fetching events:", err));
        }
      ) 
      .catch((err) => console.error("Error fetching subs:", err));
      
      fetch(BASE_URL+"/user-subs?user_id="+user.id) 
      .then((res) => res.json())
      .then((data) => {  setSub(data.data)} ) 
      .catch((err) => console.error("Error fetching subs:", err)); 

      
        
        fetch(BASE_URL+"/user-chat-heads?user_id="+user.id) 
        .then((res) => res.json())
        .then((data) => setUserChats(data)) 
        .catch((err) => console.error("Error fetching events:", err));

        socket.on("loadChatHeads", (params) => {
          // console.log("loadChatHeads", params);
          // if(params.to == user.id) {
            fetch(BASE_URL+`/user-chat-heads-by-chatroom?user_id=${user.id}&chatroom_id=${params.roomId}`) // Adjust the API endpoint as needed
            .then((res) => res.json())
            .then((data) => setUserChats((prev) => [...prev, data])) // Assuming API returns an array of { id, name }
            .catch((err) => console.error("Error fetching events:", err));  
          // }
        });
        socket.on("newMessage", (params) => {
          // console.log("newMessage", params, privateRoomIdRef.current, user.id);
          if (params.sender !== user.id && params.roomId !== privateRoomIdRef.current) {
            notify.success(params.message);
            const audio = new Audio("/noti.mp3");
            audio.play().catch((err) => {
              console.warn("Audio play blocked:", err);
            });
          }
        });
        
    }  
  }, [user]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const startPrivateChat = (us, event) => {
    // console.log("starting private hat with params", us, event, user);
    setPrivateChat(true);
    setSelectedUser(us);
    setSelectedEvent(event);
    setSelectedChat(us.name)
    var PID = [user.id, us.id].sort((a, b) => a - b).join("_");
    PID = "room_"+PID
    setPrivateRoomId(PID);
    // console.log("privateRoomId is",privateRoomId, PID);
    privateRoomIdRef.current = PID
    fetch(BASE_URL+"/user-chat-history?room_id="+PID) // Adjust the API endpoint as needed
        .then((res) => res.json())
        .then((data) => {
            setMessages(data);
            socket.emit("joinPrivateRoom", { userId: user.id, otherUserId: us.id, eventId: event.id, room:PID });
            socket.on("receivePrivateMessage", (data) => {
            // console.log("data is",data);
            if(data.message.from.id !== user.id)
            {
                setMessages((prev) => [...prev, data.message]);
            }
            });
        }
        ) 
        .catch((err) => console.error("Error fetching event chat history:", err)); 
  };
  const startPrivateChatUser = (us) => {
    // console.log("starting private hat with params", us);
    setPrivateChat(true);
    setSelectedUser(us.otherUser);
    setSelectedEvent(us.event || "0");
    setSelectedChat(us.name)
    var PID = [user.id, us.otherUser].sort((a, b) => a - b).join("_");
    PID = "room_"+PID
    setPrivateRoomId(PID);
    privateRoomIdRef.current = PID
    // console.log("startprivatechatuser privateRoomId is", us);
    // console.log("startprivatechatuser privateRoomId is" ,privateRoomId, PID, us.me,  us.otherUser, us.chatroom_id );

    fetch(BASE_URL+"/user-chat-heads-history?room_id="+us.chatroom_id) // Adjust the API endpoint as needed
        .then((res) => res.json())
        .then((data) => {
            setMessages(data);
            socket.emit("joinPrivateRoom", { userId: us.me, otherUserId: us.otherUser, eventId: null, room:us.chatroom_id });
            socket.on("receivePrivateMessage", (data) => {
            console.log("data is",data);
            if(data.message.from.id !== user.id)
            {
                setMessages((prev) => [...prev, data.message]);
            }
            });
        }
        ) 
        .catch((err) => console.error("Error fetching event chat history:", err)); 
  }; 
  const startPrivateChatUserFromGroup = (us) => {
    // console.log("starting private hat with params", us);
    setPrivateChat(true);
    setSelectedUser(us.from.id);
    setSelectedEvent(us.event_id || "0");
    setSelectedChat(us.from.name)
    var PID = [user.id, us.from.id].sort((a, b) => a - b).join("_");
    PID = "room_"+PID
    setPrivateRoomId(PID);
    privateRoomIdRef.current = PID
    console.log("sorted chatroom", PID, privateRoomIdRef)
    fetch(BASE_URL+"/user-chat-heads-history?room_id="+PID) // Adjust the API endpoint as needed
        .then((res) => res.json())
        .then((data) => {
            setMessages(data);
            socket.emit("joinPrivateRoom", { userId: us.me, otherUserId: us.from.id, eventId: null, room:PID });
            socket.on("receivePrivateMessage", (data) => {
            console.log("data is",data);
            if(data.message.from.id !== user.id)
            {
                setMessages((prev) => [...prev, data.message]);
            }
            });
        }
        ) 
        .catch((err) => console.error("Error fetching event chat history:", err)); 
  };    
const selectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedChat(event.name_ar)
    privateRoomIdRef.current = "room_"+event.id

    fetch(BASE_URL+"/user-events-chat-history?event_id="+event.id) // Adjust the API endpoint as needed
        .then((res) => res.json())
        .then((data) => {
            setMessages(data);
            socket.emit("joinRoom", { userId: user.id, eventId: event.id });
            socket.on("receiveMessage", (data) => {
            console.log("data is",data);
            if(data.message.from.id !== user.id){
                setMessages((prev) => [...prev, data.message]);
                
            }
            });
        }
        ) // Assuming API returns an array of { id, name }
        .catch((err) => console.error("Error fetching event chat history:", err)); 
  };
// const socket.off("receiveMessage");
//         socket.off("receivePrivateMessage");
const openUserSettings = () => {
  console.log("opening usr settings, reached");
    setTimeout(() => {
      console.log("opening usr settings");
      userActionRef.current?.openModal();      
    }, 1111);  
};
const goBack = () => {
    setSelectedEvent(null);
    setSelectedChat(null);
    setPrivateChat(null);
    setSelectedUser(null);
    setMessages([]);
    privateRoomIdRef.current = null;
    socket.off("receiveMessage");
    socket.off("receivePrivateMessage");
}
const formatCompactTimeAgo = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 1) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours >= 1) {
    return `${diffHours}h ${diffMinutes % 60}m ago`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes}m ago`;
  } else {
    return "just now";
  }
};


  const sendMessage = async () => {
    // if(input.length){
      if (!input.length) return;

      // Check for bad words
      const badWords = systemSettings?.bad_words?.map(item => item.word.toLowerCase()) || [];
      const inputWords = input.toLowerCase().split(/\s+/);
      const hasBadWord = inputWords.some(word => badWords.includes(word));
    
      if (hasBadWord) {
        notify.error("Your message contains a word that is not allowed.");
        return;
      }
        let data = {
            sender_id: user.id,
            to_id: 0,
            event_id: selectedEvent.id,
            chatroom_id: "room_"+selectedEvent.id,
            message: input
        }

  try {
    const response = await axios.post(`${BASE_URL}/save-event-chat`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Message saved successfully:", response.data);
    if(response.data.success){
        const now = new Date();

        const formattedDate = now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, "0") + "-" + 
        String(now.getDate()).padStart(2, "0") + " " + 
        String(now.getHours()).padStart(2, "0") + ":" + 
        String(now.getMinutes()).padStart(2, "0") + ":" + 
        String(now.getSeconds()).padStart(2, "0");
        setMessages([
          ...messages,
          { message: input, from: {name: user.name, id: user.id, avatar: user.avatar}, to: "", created_at: formattedDate },
        ]);
        let data = { message: input, from: {name: user.name, id: user.id, avatar: user.avatar}, to: "", created_at: formattedDate }
        let compiledMessage = `New Message in ${selectedEvent.name_ar} group from ${user.name}: ${input}.`
        socket.emit("sendMessage", { eventId:selectedEvent.id, userId:user.id, data, compiledMessage, roomId:"room_"+selectedEvent.id });
        setInput("");


    }
  } catch (error) {
    console.error("Error saving message:", error);
  }
// }

  };
  const handleAvatarUpdate = async (avatar) => {  
    user.avatar = avatar;
  }
  const sendPrivateMessage = async () => {
    if (!input.length) return;
    // if(input.length){
        let data = {
            sender_id: user.id,
            to_id: (selectedUser.id) ? selectedUser.id : selectedUser,
            event_id: selectedEvent.id,
            chatroom_id: privateRoomId,
            message: input
        }
        const badWords = systemSettings?.bad_words?.map(item => item.word.toLowerCase()) || [];
        const inputWords = input.toLowerCase().split(/\s+/);
        const hasBadWord = inputWords.some(word => badWords.includes(word));
      
        if (hasBadWord) {
          notify.error("Your message contains a word that is not allowed.");
          return;
        }
  try {
    const response = await axios.post(`${BASE_URL}/save-private-chat`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Message saved successfully:", response.data);
    if(response.data.success){
      if(response.data.isNew){
        socket.emit("requestloadChatHeads", { to: (selectedUser.id) ? selectedUser.id : selectedUser, roomId:privateRoomId });
      }
        const now = new Date();

        const formattedDate = now.getFullYear() + "-" + 
        String(now.getMonth() + 1).padStart(2, "0") + "-" + 
        String(now.getDate()).padStart(2, "0") + " " + 
        String(now.getHours()).padStart(2, "0") + ":" + 
        String(now.getMinutes()).padStart(2, "0") + ":" + 
        String(now.getSeconds()).padStart(2, "0");
        let data = { message: input, from: {name: user.name, id: user.id, avatar: user.avatar}, to: "", created_at: formattedDate }
        setMessages([
          ...messages,
          data,
        ]);
        console.log("data is",data, selectedEvent);
        let compiledMessage = `New Message from ${user.name}: ${input}.`

        socket.emit("sendPrivateMessage", { sender: user.id, to: selectedUser.id, event:selectedEvent.id, data: data, roomId:privateRoomId, compiledMessage, roomId: privateRoomIdRef.current });
        setInput("");
    }else{
      console.log("response.data.message is",response.data.message);
      if(response.data.message == "Free quota reached. Please purchase a subscription to continue chatting.")
      {
      goBack(); 
      openUserSettings() 
      }
      notify.error(response.data.message);
    }
  } catch (error) {
    console.error("Error saving message:", error);
    if(error.response.data.message == "Free quota reached. Please purchase a subscription to continue chatting.")
      {
      goBack();  
      openUserSettings()
      }
    notify.error(error.response.data.message);

  }
// }

  };
if (!open) return null;
  return ReactDOM.createPortal(
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pt:2,
          zIndex: 2100,
          display: "flex",
          flexDirection: "column",
        }}
      >
{/* Header */}
<AppBar
  position="static"
  sx={{
    bgcolor: "#E6A66B", // slightly darker than user bubble
    color: "#2C2C2C",
    px: 1,
    borderRadius:"20px 20px 0px 0px",
    py: 0.5,
    boxShadow: "none",
  }}
>
  <Toolbar
    disableGutters
    sx={{
      minHeight: 48,
      display: "flex",
      alignItems: "center",
      px: 1,
    }}
  >
    {/* LEFT slot - reserved width so title stays centered */}
    <Box sx={{ width: 48, display: "flex", alignItems: "center" }}>
      {selectedChat && (
        <IconButton
          edge="start"
          color="inherit"
          onClick={goBack}
          aria-label="back"
          size="large"
        >
          <FaAngleLeft />
        </IconButton>
      )}
    </Box>

    {/* CENTER - title always centered because left/right have equal reserved widths */}
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {selectedChat ? selectedChat : "Live Chat"}
      </Typography>
    </Box>
    {/* RIGHT slot - reserved width */}
    <Box sx={{ width: 48, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
        size="large"
      >
        ✖
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>
      <UserActionModal ref={userActionRef} user={user} sub={sub} onAvatarUpdate={handleAvatarUpdate} />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            bgcolor: "#141414",
          }}
        >
          {/* If NO event selected → Show event list */}
          {!selectedEvent ? (
            <>
              {events.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    onClick={() => toggleExpand(event.id)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor:"rgb(44, 44, 44)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    <Typography sx={{ color: "white !important", fontWeight: "inherit" }}>
                      {event.name_ar}
                    </Typography>

                    <Typography sx={{ color: "white !important", fontWeight: "inherit" }}>
                      ({event.users.length} Users) {expandedEvent === event.id ? "▲" : "▼"}
                    </Typography>
                  </Box>

                  {expandedEvent === event.id && (
                    <List sx={{ p: 0 }}>
                      <ListItem button onClick={() => selectEvent(event)}>
                        <ListItemText primary="Join General Chatroom" primaryTypographyProps={{ sx: { color: "white !important" } }} />
                      </ListItem>
                      {event.users
                        .filter((us) => us.id !== user.id)
                        .map((us) => (
                          <ListItem
                            button
                            key={us.id}
                            onClick={() => startPrivateChat(us, event)}
                          >
                            {us.avatar ? (
                              <Avatar src={BASE_PATH + us.avatar} />
                            ) : (
                              <Avatar>{us.name.charAt(0)}</Avatar>
                            )}
                            <ListItemText
                                 primaryTypographyProps={{ sx: { color: "white !important" } }}
                              primary={us.name}
                              sx={{ ml: 1 }}
                            />
                            <FaComments color="white" />
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Box>
              ))}

              {/* Divider */}
              {/* <Divider sx={{ my: 2 }} /> */}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold", color:"white !important" }}>
                User Chats
              </Typography>

              {/* User Chat Heads */}
              {userChats.length > 0 ? (
                userChats.map((chat) => (
                  <ListItem
                    button
                    key={chat.chatroom_id}
                    onClick={() => startPrivateChatUser(chat)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: "rgb(44, 44, 44)",
                      boxShadow: 1,
                      color:"white !important"
                    }}
                  >
                    {chat.avatar ? (
                      <Avatar src={BASE_PATH + chat.avatar} />
                    ) : (
                      <Avatar>{chat.name.charAt(0)}</Avatar>
                    )}
                    <ListItemText primary={chat.name} sx={{ ml: 1 }} />
                    <FaComments sx={{color:"white !important"}} />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary">
                  No private chats available.
                </Typography>
              )}
            </>
          ) : (
            /* If Event Selected → Show messages */
     <>
  {messages.map((msg, index) => {
    const isUser = msg.from.id === user.id;
    const senderName = isUser ? "You" : msg.from.name;
    const formattedName =
      senderName.charAt(0).toUpperCase() + senderName.slice(1);

    return (
      <Box
        key={index}
        sx={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          mb: 1.5,
        }}
      >
        <Box sx={{ maxWidth: "70%" }}>
          {/* Sender name above bubble (only if not user) */}
          {!isUser && (
            <Typography
              variant="caption"
              sx={{ mb: 0.3, ml: 1, opacity: 0.6, fontSize: "0.75rem" }}
            >
              {formattedName}
            </Typography>
          )}

          {/* Bubble */}
          <Box
            sx={{
              bgcolor: isUser ? "#FFBA83" : "#2C2C2C",
              color: isUser ? "#2C2C2C" : "#fff",
              px: 2,
              py: 1,
              borderRadius: isUser
                ? "16px 16px 4px 16px"
                : "16px 16px 16px 4px",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="body2">{msg.message}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                fontSize: "0.7rem",
                opacity: 0.6,
                mt: 0.3,
              }}
            >
              {formatCompactTimeAgo(msg.created_at)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  })}
  <div ref={messagesEndRef}></div>
</>


          )}
        </Box>

       {/* Input Area */}
{selectedEvent && (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      // maxHeight:"98%",
      pb: 4,
      bgcolor: "#141414", // darker gray than full black for contrast
    }}
  >
    <input
      type="text"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (isPrivateChat) {
            sendPrivateMessage();
          } else {
            sendMessage();
          }
        }
      }}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message..."
      style={{
        flex: 1,
        padding: "12px 16px",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        outline: "none",
        marginRight: 8,
        backgroundColor: "#2C2C2C",
        color: "#fff",
        fontSize: "14px",
      }}
    />
    <IconButton
      onClick={isPrivateChat ? sendPrivateMessage : sendMessage}
      sx={{
        bgcolor: "#FFBA83",
        color: "#2C2C2C",
        "&:hover": { bgcolor: "#e6a972" },
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <FaPaperPlane />
    </IconButton>
  </Box>
)}

  </Box>,
    document.body
  )
  
};

export default ChatComponent;
