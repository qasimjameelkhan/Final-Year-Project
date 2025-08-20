import ChatBox from "./ChatBox";
import ChatsList from "./ChatsList";
import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import socket from "../../utils/socket";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom"; // ✅ Import this
import DialogBox from "./DialogBox";

const ChatView = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const receiverId = searchParams.get("receiverId");

  const [open, setOpen] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const { addMessage, setChats, updateUserStatus, updateMessageStatus } =
    useChatStore();

  const userId = user?.userid;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log(
        "Session not authenticated or userId missing, skipping socket setup"
      );
      return;
    }

    socket.io.opts.query = { userId };
    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join_user_room", { userId });
      socket.emit("get_all_chats_req", { userId });
    };

    const handleGetAllChatsRes = (fetchedChats) => {
      console.log("📥 All chats received:", fetchedChats);
      setChats(fetchedChats);
    };

    const handleGetAllChatsError = (err) => {
      console.error("❌ Chat fetch error:", err.message);
    };

    const handleRefreshChats = ({ userId: refreshedUserId }) => {
      if (userId === refreshedUserId) {
        console.log("Refreshing chats for user:", userId);
        socket.emit("get_all_chats_req", { userId });
      }
    };

    const handleNewMessage = ({ message }) => {
      console.log("📥 New message:", message);
      addMessage(message);
    };

    const handleConfirmedMessage = ({ message }) => {
      console.log("📥 Confirmed message:", message);
      addMessage(message);
    };

    const handleMessageStatus = ({ messageId, status }) => {
      console.log(`📥 Status update: messageId=${messageId}, status=${status}`);
      updateMessageStatus(messageId, status, userId);
    };

    const handleUserStatusUpdate = ({ userId, status, lastSeen }) => {
      console.log(`📥 User status update: userId=${userId}, status=${status}`);
      updateUserStatus(userId, { status, lastSeen });
    };

    socket.on("connect", handleConnect);
    socket.on("get_all_chats_res", handleGetAllChatsRes);
    socket.on("get_all_chats_error", handleGetAllChatsError);
    socket.on("refresh_chats", handleRefreshChats);
    socket.on("event:message", handleNewMessage);
    socket.on("event:message:confirmed", handleConfirmedMessage);
    socket.on("event:message:status", handleMessageStatus);
    socket.on("user_status_update", handleUserStatusUpdate);

    if (socket.connected) {
      console.log("Socket already connected, fetching chats...");
      socket.emit("join_user_room", { userId });
      socket.emit("get_all_chats_req", { userId });
    }

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("get_all_chats_res", handleGetAllChatsRes);
      socket.off("get_all_chats_error", handleGetAllChatsError);
      socket.off("refresh_chats", handleRefreshChats);
      socket.off("event:message", handleNewMessage);
      socket.off("event:message:confirmed", handleConfirmedMessage);
      socket.off("event", handleMessageStatus);
      socket.off("user_status_update", handleUserStatusUpdate);
    };
  }, [
    isAuthenticated,
    userId,
    setChats,
    addMessage,
    updateUserStatus,
    updateMessageStatus,
  ]);

  useEffect(() => {
    if (receiverId) {
      setOpen(true);
    }
  }, [receiverId]);

  const newMessageRequest = async () => {
    const payload = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: userId,
      receiverId: receiverId,
      text: textMessage,
    };

    console.log("Sending socket payload:", payload);

    socket.emit("send_message_req", payload);

    setTextMessage("");
    setOpen(false);

    const cleanedUrl = window.location.origin + window.location.pathname;
    window.location.href = cleanedUrl;
  };

  return (
    <>
      <DialogBox
        open={open}
        onClose={() => setOpen(false)}
        textMessage={textMessage}
        setTextMessage={setTextMessage}
        onSend={newMessageRequest}
      />

      <div className="h-[80vh] w-[90%] flex items-start justify-center mt-10 mb-20 mx-auto">
        <div className="w-1/4 h-full">
          <ChatsList />
        </div>
        <div className="w-3/4">
          <ChatBox />
        </div>
      </div>
    </>
  );
};

export default ChatView;
