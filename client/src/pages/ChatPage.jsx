import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { Header } from "../components/Header";
import MessageInput from "../components/MessageInput";
import { axiosInstance } from "../lib/axios";

const ChatPage = () => {
  const { id: chatPartnerId } = useParams(); // URL의 :id가 채팅 상대의 ID
  const { authUser } = useAuthStore();
  const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages, loading } = useMessageStore();
  const [chatPartner, setChatPartner] = useState(null);

  // 채팅 상대 프로필 데이터 불러오기 (예: /users/:id 엔드포인트)
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
      // 대화 기록 불러오기
      getMessages(chatPartnerId);
      // 새 메시지 수신 구독
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [authUser, chatPartnerId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

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
          <img
            src={chatPartner && chatPartner.image ? chatPartner.image : "/avatar.png"}
            alt="Chat Partner"
            className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-green-300"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Chat with {chatPartner ? chatPartner.name : chatPartnerId}
          </h2>
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
    </div>
  );
};

export default ChatPage;
