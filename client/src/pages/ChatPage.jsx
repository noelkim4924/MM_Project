import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { Header } from "../components/Header";
import MessageInput from "../components/MessageInput";
import { axiosInstance } from '../lib/axios'; 
import ConfirmToast from "../components/admin/ConfirmToast";

const ChatPage = () => {
  const { id: chatPartnerId } = useParams();
  const { authUser } = useAuthStore();
  const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages, loading, clearMessages } = useMessageStore();
  const { removeMatch } = useMatchStore();
  const navigate = useNavigate();
  const [chatPartner, setChatPartner] = useState(null);
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    if (chatPartnerId) {
      axiosInstance
        .get(`/users/${chatPartnerId}`)
        .then((res) => {
          setChatPartner(res.data);
        })
        .catch((err) => {
          console.error("Error fetching chat partner profile:", err);
        });
    }
  }, [chatPartnerId]);

  useEffect(() => {
    if (authUser && chatPartnerId) {
      getMessages(chatPartnerId);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [authUser, chatPartnerId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  const handleLeaveChat = () => {
    setIsToastOpen(true);
  };

  const confirmLeave = async () => {
    try {
 
      await axiosInstance.delete(`/messages/conversation/${chatPartnerId}`);

      await axiosInstance.post(`/matches/unmatch/${chatPartnerId}`);
   
      clearMessages(); 
      removeMatch(chatPartnerId); 
      setIsToastOpen(false);
      navigate("/home");
    } catch (error) {
      console.error("Error leaving chat:", error);
      setIsToastOpen(false);
      toast.error("Failed to leave chat. Please try again.");
    }
  };

  const closeToast = () => {
    setIsToastOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4">
        <div className="flex items-center mb-4 bg-white rounded-lg shadow p-3">
          <div className="flex items-center">
            <img
              src={chatPartner && chatPartner.image ? chatPartner.image : "/avatar.png"}
              alt="Chat Partner"
              className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-green-300"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Chat with {chatPartner ? chatPartner.name : chatPartnerId}
            </h2>
          </div>
          <button
            onClick={handleLeaveChat}
            className="ml-auto px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Leave
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Start your conversation with {chatPartner ? chatPartner.name : chatPartnerId}
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-3 ${msg.sender === authUser._id ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                    msg.sender === authUser._id
                      ? "bg-blue-300 text-white"
                      : "bg-green-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))
          )}
        </div>
        <MessageInput chatPartnerId={chatPartnerId} />
      </div>

      <ConfirmToast
        type="decline"
        message="are you really want to leave this chat?"
        onConfirm={confirmLeave}
        onCancel={closeToast}
        isOpen={isToastOpen}
      />
    </div>
  );
};

export default ChatPage;