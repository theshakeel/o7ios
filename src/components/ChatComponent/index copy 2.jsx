import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments, FaAngleLeft, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import io from 'socket.io-client';
import styles from "./style";
import { notify } from "../../utils";
import { selectUser } from "../../store/slice/user";
import UserActionModal from '../UserActionModal/index.jsx';
import { Menu, MenuItem, IconButton } from '@mui/material';
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

const ChatComponent = () => {
  const userActionRef = useRef();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPrivateChat, setPrivateChat] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [privateRoomId, setPrivateRoomId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const privateRoomIdRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sub, setSub] = useState(null);
  const [events, setEvents] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const user = useSelector(selectUser);
  // console.log("user is", user)
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("closing modal...");
    setOpen(false)
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

      return (
        <>
        { (user.id) ? <div
            onClick={toggleChat}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
              backgroundColor: "#FFBA83",
              color: "#2C2C2C",
              borderRadius: "30px",
              width: "140px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "pointer",
            }}
            title={chatOpen ? "Close Chat" : "Open Chat"}
          >
            <FaComments size={28} /> <span style={{paddingLeft:"10px"}} >Event Chat</span>
          </div> : null }
          
          {chatOpen && user ? (
    <div style={styles.overlay}>
      
      <div style={styles.chatContainer}>
        {/* Header */}
        <div style={styles.chatHeader}>
          {selectedChat ? ( 
            <div> 
            <span style={styles.backButton} onClick={goBack}> 
                  <FaAngleLeft style={styles.chatIconBlack} />
            
             </span> 
            <span>{selectedChat}</span>
            </div>
            ) : (
              <div style={styles.chatHeader} onClick={handleOpen}>
                {user.avatar ? (
                  <img src={BASE_PATH+user.avatar} alt={user.name} style={styles.userAvatar} />
                ) : (
                  <div style={styles.userChatBubbleGold}>
                    {(user.name || "")
                      .split(" ")
                      .map(word => word.charAt(0).toUpperCase())
                      .join("")}
                  </div>
                )}
                <span style={{ marginLeft: 8 }}>Live chat</span>
                {/* <UserActionModal open={open} onClose={handleClose} user={user} sub={sub} /> */}
                <UserActionModal ref={userActionRef} user={user} sub={sub} onAvatarUpdate={handleAvatarUpdate} />
                </div>
            )
            }
          <button style={styles.closeButton} onClick={toggleChat}>
            ✖
          </button>
        </div>
        {!selectedEvent ? (
  <div style={styles.eventsList}>
    {/* Render Event List */}
    {events.map((event) => (
      <div key={event.id} style={styles.eventItem}>
        {/* Event Header (Click to Expand/Collapse) */}
        <div style={styles.eventHeader} onClick={() => toggleExpand(event.id)}>
          <span>{event.name_ar}</span>
          <span>
            ({event.users.length} Users) {expandedEvent === event.id ? "▲" : "▼"}
          </span>
        </div>

        {/* User List (Shown Only if Expanded) */}
        {expandedEvent === event.id && (
          <div style={styles.userList}>
            {/* General Chatroom Item */}
            <div style={styles.generalChatItem} onClick={() => selectEvent(event)}>
              Join General Chatroom
            </div>

            {/* User List */}
            {event.users
              .filter((us) => us.id !== user.id)
              .map((us) => (
                <div key={us.id} style={styles.userItem} onClick={() => startPrivateChat(us, event)}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {us.avatar ? (
                    <img src={BASE_PATH+us.avatar} alt={us.name} style={styles.userAvatar} />  
                  ) : (
                    <div style={styles.userChatBubble}>
                      {us.name
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase())
                        .join("")}
                    </div>
                  )}
                    <span style={styles.userChatName}>{us.name}</span>
                  </div>
                  <FaComments style={styles.chatIcon} />
                </div>
            ))}
          </div>
        )}
      </div>
    ))}

    {/* Divider & User Chat Heads Section */}
    <div style={styles.headDivider} />
    <div style={styles.headHeading}>User Chats</div>

    {/* Render User Chat Heads */}
    <div style={styles.headUserChats}>
      {userChats.length > 0 ? (
        userChats.map((chat) => (
          <div
            key={chat.chatroom_id}
            style={styles.headChatHeadItem}
            onClick={() => startPrivateChatUser(chat)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.userBubble}>
            {chat.avatar ? (
                <img src={BASE_PATH+chat.avatar} alt={chat.name} style={styles.avatar} />
            ) : (
                chat.name.charAt(0)
            )}
              </div>
              <span>{chat.name}</span>
            </div>
            <FaComments style={styles.headChatIcon} />
          </div>
        ))
      ) : (
        <p style={styles.headNoChats}>No private chats available.</p>
      )}
    </div>
  </div>
) 
        
        : (
          <>
            {/* Chat Messages */}
            <div  style={styles.chatMessages}>
                {messages.map((msg, index) => {
                    const isUser = msg.from.id === user.id;
                    const senderName = isUser ? "You" : msg.from.name;
                    const formattedName = senderName.charAt(0).toUpperCase() + senderName.slice(1); // Capitalize first letter

                    return (
                    <div key={index} style={{ ...styles.messageWrapper, justifyContent: isUser ? "flex-end" : "flex-start" }}>
                        { isUser ? (
                            <div style={{ ...styles.messageContent, alignItems: isUser ? "flex-end" : "flex-start" }}>
                            <div style={styles.messageText}>
                                <div style={styles.userBubble} >
                                    {msg.from.avatar ? (
                                        <img src={BASE_PATH+msg.from.avatar} alt={formattedName} style={styles.avatar} />
                                    ) : (
                                        formattedName.charAt(0)
                                    )}
                                </div>
                             {msg.message}
                            </div>
                            <div style={styles.messageTime}>{formatTimeAgo(msg.created_at)}</div>
                        </div>
                        ) : (
                            <div style={{ ...styles.messageContentRight, alignItems: isUser ? "flex-end" : "flex-start" }}>
                            <div style={styles.messageText}>
                            <div style={styles.userBubble} onClick={(e) => handleOpenMenu(e, msg)}>
  {msg.from.avatar ? (
    <img src={BASE_PATH + msg.from.avatar} alt={formattedName} style={styles.avatar} />
  ) : (
    formattedName.charAt(0)
  )}
</div>

<Menu
  anchorEl={anchorEl}
  open={openMenu}
  onClose={handleCloseMenu}
  transitionDuration={0}
  keepMounted={false}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  PaperProps={{
    style: {
      backgroundColor: 'rgba(33, 33, 33, 0.9)',
      color: '#fff',
      borderRadius: '8px',
      minWidth: '200px',
      boxShadow: 'none',
      backdropFilter: 'blur(6px)',
      padding: '12px',
    },
  }}
>
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <IconButton size="small" onClick={handleCloseMenu}>
      <CloseIcon fontSize="small" style={{ color: '#fff' }} />
    </IconButton>
  </div>

  {/* Info Section */}
  {selectedMsg && (
    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
      {selectedMsg.from.avatar ? (
        <img 
          src={BASE_PATH + selectedMsg.from.avatar} 
          alt={selectedMsg.from.name || ''}
          style={{ width: 60, height: 60, borderRadius: '50%', marginBottom: 8 }}
        />
      ) : (
        <div style={{ 
          width: 60, height: 60, borderRadius: '50%', 
          backgroundColor: '#555', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 8px',
          fontSize: '24px',
        }}>
          {selectedMsg.from.name?.charAt(0)}
        </div>
      )}
      <div style={{ fontWeight: 'bold' }}>{selectedMsg.from.name}</div>
    </div>
  )}

  {/* Button */}
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <button
      onClick={() => {
        startPrivateChatUserFromGroup(selectedMsg);
        handleCloseMenu();
      }}
      style={{
        padding: '8px 16px',
        backgroundColor: 'rgb(255, 186, 131)',
        border: 'none',
        borderRadius: '4px',
        color: 'rgb(44, 44, 44)',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Start Private Chat
    </button>
  </div>
</Menu>
                             {msg.message}
                            </div>
                            <div style={styles.messageTime}>{formatTimeAgo(msg.created_at)}</div>
                        </div>
                        ) }
                        
                        
                    </div>
                    );
                })}
                <div ref={messagesEndRef}></div>
                </div>

            {/* Input Field */}
            {(!systemSettings || !systemSettings.blocked_users?.some(user => user.user_id !== user.id)) ? (
  <div style={styles.chatInputContainer}>
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
      style={styles.chatInput}
    />
    {
      isPrivateChat ? (
        <button onClick={sendPrivateMessage} style={styles.sendButton}>
                            <FaPaperPlane style={styles.chatIconBlack} />

        </button>
      ) : (
        <button onClick={sendMessage} style={styles.sendButton}>
                            <FaPaperPlane style={styles.chatIconBlack} />

        </button>
      )
    }
  </div>
) : (
  <p style={{ padding: 10, color: 'red', fontWeight: 'bold' }}>You have been blocked, please contact support</p>
)}
          </>
        )}
      </div>
    </div>

  ): null }
        </>
      );
      
  
};

export default ChatComponent;
