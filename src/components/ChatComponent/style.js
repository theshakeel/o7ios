const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      zIndex: 1000,
    },
    chatContainer: {
        position: "fixed",  // Stays fixed on screen
        right: "1px",      // Positioned to the right
        top: "0",           // Starts from the top
        height: "100dvh",    // Occupies full viewport height
        width: "307px",
        backgroundColor: "rgb(26, 26, 26)",
        color: "rgb(255, 255, 255)",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 10px",
        display: "flex",
        flexDirection: "column",
    },
    
    closeButton: {
      cursor: "pointer",
      fontSize: "20px",
      color: "#2C2C2C",
      background: "none",
      border: "none",
    },
    eventsList: {
        flex: "8.5",   // Takes 80% of the height
        padding: "15px",
        overflowY: "auto", // Enables scrolling if messages exceed space
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        scrollbarWidth: "thin", /* For Firefox */
        scrollbarColor: "#888 #333", /* Thumb & Track colors */
        "::-webkit-scrollbar": {
        width: "6px", /* Slim width */
        },
        "::-webkit-scrollbar-track": {
            background: "#333", /* Track color */
            borderRadius: "5px",
        },

        "::-webkit-scrollbar-thumb": {
            background: "#888", /* Thumb color */
            borderRadius: "5px",
        },

        "::-webkit-scrollbar-thumb:hover": {
            background: "#aaa", /* Lighter on hover */
        },
    },
    
      eventItem: {
        background: "#333",
        padding: "10px",
        marginBottom: "8px",
        borderRadius: "6px",
      },
      eventHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#fff",
      },
      userList: {
        marginTop: "8px",
        paddingLeft: "10px",
        borderLeft: "2px solid #555",
        maxHeight: "200px", // Limit height
        overflowY: "auto",  // Enable scrolling
        scrollbarWidth: "thin", // Firefox scrollbar styling
        scrollbarColor: "#666 #333", // Custom scrollbar colors
      },
      chatIcon: {
        color: "#FFBA83",
        fontSize: "18px",
      },
      chatIconBlack: {
        color: "#2C2C2C",
        fontSize: "18px",
      },
      
      generalChatItem: {
        fontWeight: "bold",
        padding: "10px",
        textAlign: "center",
        background: "#333",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#FFBA83",
        marginBottom: "6px",
      },
      userItem: {
        display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Push icon to the right
  padding: "10px",
  borderBottom: "1px solid #ccc",
  cursor: "pointer",
  '&:hover': {
    backgroundColor: "#2A2A2A", // Darker shade on hover
  },
      },
      userItemHover: {
        background: "#444",
      },
      userAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        marginRight: "8px",
        marginleft: "8px",
      },
      avatar: {
        width: "33px",
        height: "33px",
        borderRadius: "50%",
      },
    eventItem: {
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "5px",
      cursor: "pointer",
      backgroundColor: "#333",
      color: "#fff",
    },
    chatHeader: {
        backgroundColor: "#FFBA83",
        padding: "4px",
        color:"#2C2C2C",
        fontSize: "18px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "21px 29px 3px 3px",
        flex: "0.7",   // Takes 10% of the height
    },
    
    chatMessages: {
        flex: "8.5",   // Takes 80% of the height
        padding: "15px",
        overflowY: "auto", // Enables scrolling if messages exceed space
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        scrollbarWidth: "thin", /* For Firefox */
        scrollbarColor: "#888 #333", /* Thumb & Track colors */
        "::-webkit-scrollbar": {
        width: "6px", /* Slim width */
        },
        "::-webkit-scrollbar-track": {
            background: "#333", /* Track color */
            borderRadius: "5px",
        },

        "::-webkit-scrollbar-thumb": {
            background: "#888", /* Thumb color */
            borderRadius: "5px",
        },

        "::-webkit-scrollbar-thumb:hover": {
            background: "#aaa", /* Lighter on hover */
        },
    },
    
    chatInputContainer: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid rgb(51, 51, 51)",
        backgroundColor: "rgb(34, 34, 34)",
        flex: "0.8",   // Takes 10% of the height
    },
    chatInput: {
      flex: 1,
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #444",
      outline: "none",
      backgroundColor: "#333",
      color: "#fff",
    },
    sendButton: {
      marginLeft: "10px",
      padding: "0px 14px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#FFBA83",
      color: "#fff",
      cursor: "pointer",
      fontSize:"26px",
    },
    messageWrapper: (isUser) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: isUser ? "flex-end" : "flex-start",
      gap: "10px",
    }),
    userBubble: {
      width: 33,
      cursor:"pointer",
      height: 33,
      backgroundColor: '#FFBA83',
      color: 'white',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 21,
      fontWeight: 'bold',
      verticalAlign: 'middle', // Aligns with text baseline
      marginRight: 8, // Optional spacing from the message text
    },
    messageContent: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#333",
      padding: "10px",
      borderRadius: "10px",
      width: 'fit-content'
    },
    backButton:{
        cursor:"pointer",
        padding:"10px",
        fontSize:"23px"
    },
    messageContentRight: {
    flexDirection: "column",
    backgroundColor: "rgb(51, 51, 51)",
    padding: "10px",
    borderRadius: "10px",
    width: "fit-content",
    /* align-items: flex-end, */
    /* align-self: flex-end, */
    float: "right",
      },
    messageText: {
      fontSize: "14px",
    },
    messageTime: {
      fontSize: "10px",
      color: "#888",
      marginTop: "5px",
    },
    headDivider: {
        height: "2px",
        backgroundColor: "#ccc",
        margin: "15px 0",
      },
      headHeading: {
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "8px",
      },
      headUserChats: {
        padding: "1px",
        backgroundColor: "transparent",
        borderRadius: "5px",
      },
      headChatHeadItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "rgb(51, 51, 51)",
        borderRadius: "4px",
        marginBottom: "5px",
      },
      userChatBubbleGold:{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#FFBA83",
        fontSize: "20px",
        textTransform: "uppercase",
      },
      userChatBubble:{
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: "#FFBA83",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#2C2C2C",
        fontSize: 14,
        textTransform: "uppercase",
      },
      userChatName:{
        paddingLeft:"5px"
      },
      headAvatar: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        marginRight: "10px",
      },
      headChatIcon: {
        color: "#FFBA83",
        fontSize: "18px",
      },
      headNoChats: {
        textAlign: "center",
        color: "#888",
        fontSize: "14px",
      },
    
    messageBubble: (isUser) => ({
      maxWidth: "75%",
      padding: "10px",
      borderRadius: "10px",
      marginBottom: "8px",
      backgroundColor: isUser ? "#FFBA83" : "#333",
      color: "#fff",
      alignSelf: isUser ? "flex-end" : "flex-start",
    }),
  };
  
  export default styles;
