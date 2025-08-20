import React, { useCallback, useEffect } from "react";
import { Check, CheckCheck, Search } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import moment from "moment";
import socket from "../../utils/socket";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { HiOutlineUserCircle } from "react-icons/hi2";

const ChatsList = () => {
  const { user } = useSelector((state) => state.user);

  const {
    chats,
    setSelectedChatId,
    selectedChatId,
    setSelectedChatProfiles,
    setMessages,
    messages,
    userStatuses,
    updateUserStatus,
    updateMessageStatus,
    setChat,
  } = useChatStore();

  const userId = user?.userid;

  const handleSelectChat = useCallback(
    debounce((chatId) => {
      console.log(`Selecting chat: ${chatId}`);
      setSelectedChatId(chatId);
      setChat(chatId, { unviewedCount: 0 });
      socket.emit("get_chat_messages_req", { chatId });
    }, 500),
    [setSelectedChatId, selectedChatId, setChat]
  );

  useEffect(() => {
    // Define the status listener as a named function
    const handleMessageStatus = ({ messageId, status }) => {
      console.log(`Status update: messageId=${messageId}, status=${status}`);
      updateMessageStatus(messageId, status, userId);
      // Refresh chats to update latest message status
      socket.emit("get_all_chats_req", { userId });
    };

    socket.on(
      "get_chat_messages_res",
      ({ messages, senderProfile, receiverProfile }) => {
        console.log(`Received messages for chat: ${selectedChatId}`);
        setMessages(messages);
        setSelectedChatProfiles({
          sender: senderProfile,
          receiver: receiverProfile,
        });
        console.log("senderProfile", senderProfile);
        updateUserStatus(senderProfile.id, {
          status: senderProfile.status || "offline",
          lastSeen: senderProfile.lastSeen,
        });
        updateUserStatus(receiverProfile.id, {
          status: receiverProfile.status || "offline",
          lastSeen: receiverProfile.lastSeen,
        });
      }
    );

    socket.on("event:message:status", handleMessageStatus);

    return () => {
      socket.off("get_chat_messages_res");
      socket.off("event:message:status", handleMessageStatus);
    };
  }, [
    setMessages,
    setSelectedChatProfiles,
    updateUserStatus,
    updateMessageStatus,
    selectedChatId,
    userId,
    messages,
  ]);

  if (!userId) return null;

  const filteredChats = chats?.map((chat) => {
    const isSender = chat.senderId === userId;
    const otherUser = isSender ? chat.receiver : chat.sender;
    const otherUserStatus = userStatuses[otherUser.id] || {
      status: otherUser.status || "offline",
      lastSeen: otherUser.lastSeen || null,
    };

    return {
      id: chat.id,
      otherUser,
      lastMessage: chat.latestMessage
        ? {
            id: chat.latestMessage.id,
            text: chat.latestMessage.text,
            createdAt: chat.latestMessage.createdAt,
            viewed: chat.latestMessage.viewed,
            senderId: chat.latestMessage.senderId,
          }
        : null,
      timestamp: chat.latestMessage?.createdAt || chat.createdAt,
      status: otherUserStatus.status,
      lastSeen: otherUserStatus.lastSeen,
      isLastMessageSender: chat.latestMessage
        ? chat.latestMessage.senderId === userId
        : false,
      unviewedCount: chat.unviewedCount || 0,
    };
  });

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

  console.log("ChatsList user:", selectedChatId);

  return (
    <div className="w-full h-full border rounded-lg overflow-y-auto">
      <div className="flex flex-col h-36 px-3 py-4 space-y-8">
        <p className="text-2xl font-semibold">Chats</p>
        <div className="border-1 flex flex-row rounded-lg px-2 py-2 gap-3 bg-white border-grey-300 p-2">
          <Search className="text-gray-500" />
          <input
            className="outline-none border-none bg-transparent w-full"
            placeholder="Chats search..."
          />
        </div>
      </div>

      {chats.length <= 0 ? (
        <div>
          <p className="text-center text-gray-500 py-4">No chats available</p>
        </div>
      ) : (
        <div className="w-full border-t-1">
          {filteredChats &&
            filteredChats?.map((chat) => {
              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center space-x-3 px-3 h-20 cursor-pointer border-b hover:bg-gray-100 py-2 ${
                    selectedChatId === chat.id ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="relative">
                    <HiOutlineUserCircle size={42} className="text-gray-500" />

                    <div
                      className={`${
                        chat.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      } w-2 h-2 rounded-full absolute bottom-1 right-1 translate-x-1/2 translate-y-1/2`}
                    ></div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                      <p className="font-medium">{chat.otherUser.username}</p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {moment(chat.timestamp).isSame(moment(), "day")
                          ? moment(chat.timestamp).format("LT")
                          : moment(chat.timestamp).fromNow()}
                      </span>
                    </div>
                    <div className="flex flex-row max-w-full items-center gap-2">
                      {chat.lastMessage ? (
                        <>
                          {chat.isLastMessageSender && (
                            <span>
                              {getStatusIcon(chat.lastMessage.viewed)}
                            </span>
                          )}
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage.text}
                          </p>
                          {chat.unviewedCount > 0 && (
                            <span className="text-xs text-white flex items-center justify-center w-[20px] h-[20px] bg-blue-500 rounded-full">
                              {chat.unviewedCount}
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No messages
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ChatsList;
