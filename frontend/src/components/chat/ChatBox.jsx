import React, { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Ellipsis, Paperclip } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import moment from "moment";
import socket from "../../utils/socket";
import { useSelector } from "react-redux";
import { PiUserCircleLight } from "react-icons/pi";

const ChatBox = () => {
  const { user } = useSelector((state) => state.user);
  const userId = user?.userid;
  const {
    messages,
    addMessage,
    selectedChatId,
    selectedChatProfiles,
    chats,
    setMessages,
    userStatuses,
    updateMessageStatus,
  } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for CardContent

  // Scroll to the bottom of the CardContent
  const scrollToBottom = () => {
    if (chatContainerRef.current && messagesEndRef.current) {
      const container = chatContainerRef.current;
      const endElement = messagesEndRef.current;
      // Scroll to the end element's offset within the container
      container.scrollTo({
        top: endElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Consolidated Socket.IO event listeners
  useEffect(() => {
    if (!selectedChatId || !userId) return;
    // Join chat room
    socket.emit("join_chat_room", { chatId: selectedChatId });
    console.log(`Joined chat room ${selectedChatId} for user ${userId}`);

    // Handle incoming messages
    const handleIncomingMessage = ({ message }) => {
      console.log("Received message:", message);
      if (message.chatId === selectedChatId) {
        addMessage(message);
      }
    };

    // Handle confirmed messages
    const handleConfirmedMessage = ({ message }) => {
      console.log("Confirmed message:", message);
      if (message.chatId === selectedChatId) {
        console.log("message", message);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === message.id ? message : msg))
        );
      }
    };

    // Handle message status updates
    const handleMessageStatus = ({ messageId, status }) => {
      console.log(`Status update: messageId=${messageId}, status=${status}`);
      updateMessageStatus(messageId, status, userId);
    };

    socket.on("event:message", handleIncomingMessage);
    socket.on("event:message:confirmed", handleConfirmedMessage);
    socket.on("event:message:status", handleMessageStatus);

    // Fetch messages
    const timer = setTimeout(() => {
      console.log("Fetching messages for chat:", selectedChatId);
      socket.emit("get_chat_messages_req", { chatId: selectedChatId });
    }, 500);

    return () => {
      // Leave chat room
      if (selectedChatId) {
        socket.emit("leave_chat_room", { chatId: selectedChatId });
        console.log(`Left chat room ${selectedChatId} for user ${userId}`);
      }

      // Clean up listeners
      socket.off("event:message", handleIncomingMessage);
      socket.off("event:message:confirmed", handleConfirmedMessage);
      socket.off("event:message:status", handleMessageStatus);
      clearTimeout(timer);
    };
  }, [selectedChatId, userId, addMessage, setMessages, updateMessageStatus]);

  // Scroll to bottom when messages or selectedChatId change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatId]);

  // IntersectionObserver for marking messages as viewed
  useEffect(() => {
    if (!selectedChatId || !userId || !chatContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-id");
            if (messageId) {
              console.log(
                `Message ${messageId} is visible, emitting mark_message_viewed`
              );
              socket.emit(
                "mark_message_viewed",
                { chatId: selectedChatId, messageId },
                (response) => {
                  console.log(
                    `mark_message_viewed response for ${messageId}:`,
                    response
                  );
                  if (response.error) {
                    console.error(
                      `Failed to mark message ${messageId} as viewed: ${response.error}`
                    );
                  }
                }
              );
            }
          }
        });
      },
      { root: chatContainerRef.current, threshold: 0.5 }
    );

    const messageElements =
      chatContainerRef.current?.querySelectorAll(".message-container");
    messageElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedChatId, userId, messages]);

  if (chats.length <= 0) {
    return (
      <div>
        <p className="text-center text-gray-500 py-4">No chats available</p>
      </div>
    );
  }
  if (!selectedChatId)
    return (
      <div>
        <p className="text-center text-gray-500 py-4">Select a chat</p>
      </div>
    );
  if (!selectedChatProfiles || !userId)
    return <div className="text-center">Loading chat data...</div>;

  // ✅ Safe destructuring after null check
  const { sender, receiver } = selectedChatProfiles;

  console.log("sender", selectedChatProfiles);

  // ✅ Determine "me" and "other"
  const me = sender.id === userId ? sender : receiver;
  const otherUser = sender.id !== userId ? sender : receiver;

  // Get other user's status from userStatuses or selectedChatProfiles
  const otherUserStatus = userStatuses[otherUser.id] || {
    status: otherUser.status || "offline",
    lastSeen: otherUser.lastSeen || null,
  };

  // Format status display
  const getStatusDisplay = () => {
    if (otherUserStatus.status === "online") {
      return <span className="text-sm text-green-500">Online</span>;
    }
    if (otherUserStatus.lastSeen) {
      return (
        <span className="text-sm text-gray-500">
          Last seen {moment(otherUserStatus.lastSeen).fromNow()}
        </span>
      );
    }
    return <span className="text-sm text-gray-500">Offline</span>;
  };

  const filteredMessages =
    messages &&
    messages?.map((message) => {
      const isSender = message.senderId === userId;

      return {
        ...message,
        from: isSender ? me : otherUser,
        isMine: isSender,
      };
    });

  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const dateKey = moment(message.createdAt).format("dddd, MMM D"); // e.g., "Tuesday, May 25"
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChatId || !userId) return;

    const messagePayload = {
      id: `${Date.now()}-${Math.random()}`, // generate temp id or use uuid
      chatId: selectedChatId,
      senderId: userId,
      receiverId:
        selectedChatProfiles?.sender.userid === userId
          ? selectedChatProfiles.receiver.userid
          : selectedChatProfiles.sender.userid,
      text: newMessage,
      createdAt: new Date(),
      viewed: "SENT", // Initial status
    };
    socket.emit("event:message", messagePayload);
    addMessage(messagePayload); // Optimistic update
    setNewMessage("");
    scrollToBottom();
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Allow Shift + Enter for new lines
      e.preventDefault(); // Prevent default to avoid adding a newline
      sendMessage();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SENT":
        return <Check size={15} className="text-gray-500" />;
      case "DELIVERED":
        return <CheckCheck size={15} className="text-gray-500" />;
      case "VIEWED":
        return <CheckCheck size={15} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 flex flex-col justify-between h-[80vh] w-full">
      <div className=" bg-white h-12 flex flex-row items-center justify-between w-full bg-white p-2 rounded-md">
        <div className="flex flex-row items-center gap-3">
          <PiUserCircleLight size={34} />

          <div className="flex flex-col">
            <span className="font-semibold">{otherUser.username}</span>
            <span className="text-sm text-green-500">{getStatusDisplay()}</span>
          </div>
        </div>

        <Ellipsis />
      </div>
      <div
        ref={chatContainerRef}
        className="py-4 pl-0 pr-2 space-y-3 flex-1 overflow-y-auto"
      >
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="flex justify-center">
              <span className="text-xs text-muted-foreground bg-gray-200 px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            {messages?.map((msg) => (
              <div
                key={msg?.id}
                className={`flex w-full mb-2 ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col items-start max-w-xs">
                  <div
                    className={`bg-muted rounded-md border p-3 ${
                      msg.isMine
                        ? "self-end bg-blue-100"
                        : "self-start bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex flex-row mt-1 self-end justify-center items-center gap-2">
                    <span className="text-muted-foreground text-xs ">
                      {moment(msg.createdAt).format("LT")}
                    </span>
                    {msg.isMine && getStatusIcon(msg.viewed)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-row px-4 py-2 border-1 rounded-md w-full justify-between border-gray-300 bg-white">
        <input
          placeholder="Type your message..."
          className="outline-none border-none w-10/12 bg-transparent"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          onKeyDown={handleKeyDown}
        />
        <div className="flex flex-row items-center gap-3 w-2/12 justify-end">
          <button
            variant="outline"
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
