// import { Header } from "../components/Header";
// import { useAuthStore } from '../store/useAuthStore';
// import { useMessageStore } from '../store/useMessageStore';

// const ChatPage = () => {
//     const { messages } = useMessageStore();
//     const { authUser } = useAuthStore();

//     return (
//         <div className='flex flex-col h-screen bg-gray-100 bg-opacity-50'>
//             <Header />

//             <div className='flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full'>
//                 <div className='flex items-center mb-4 bg-white rounded-lg shadow p-3'>
//                     <img 
//                         src={"/avatar.png"} 
//                         className='w-12 h-12 object-cover rounded-full mr-3 border-2 border-pink-300' 
//                     />
//                     <h2 className='text-xl font-semibold text-gray-800'>John Doe</h2>
//                 </div>

//                 <div className='flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4'>
//                     {messages.length === 0 ? (
//                         <p className='text-center text-gray-500 py-8'>
//                             Start your conversation with John Doe
//                         </p>
//                     ) : (
//                         messages.map((msg) => (
//                             <div 
//                                 key={msg._id} 
//                                 className={`mb-3 ${msg.sender === authUser._id ? "text-right" : "text-left"}`}
//                             >
//                                 <span
//                                     className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
//                                         msg.sender === authUser._id
//                                             ? "bg-pink-500 text-white"
//                                             : "bg-gray-200 text-gray-800"
//                                     }`}
//                                 >
//                                     {msg.content}
//                                 </span>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 <div>message input</div>
//             </div>
//         </div>
//     );
// };

// export default ChatPage;

{/* up code is when we imp matching systmes we will use  */}
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 더미 유저 목록 (seedMentors.js에서 생성된 ID 사용)
const dummyUsers = [
  { id: "67d2c49e371297ace224d4b2", name: "James" },
  { id: "67d2c49e371297ace224d4b3", name: "John" },
  { id: "67d2c49e371297ace224d4b4", name: "Mary" },
  { id: "67d2c49e371297ace224d4b5", name: "Patricia" },
  { id: "67d2c49e371297ace224d4b6", name: "Alex" },
];

const ChatPage = () => {
  const { messages, sendMessage, getMessages, subscribeToMessages, unsubscribeFromMessages } =
    useMessageStore();
  const { authUser } = useAuthStore();
  const { id } = useParams(); // URL 파라미터에서 receiverId 가져오기
  const [receiverId, setReceiverId] = useState(id || dummyUsers[0].id); // 기본값 설정
  const [message, setMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(dummyUsers[0].name);

  useEffect(() => {
    if (receiverId && authUser?._id) {
      getMessages(receiverId);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [receiverId, authUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  const handleSendMessage = () => {
    if (message.trim() && authUser?._id && receiverId) {
      sendMessage(receiverId, message);
      setMessage("");
    }
  };

  const handleSelectPartner = (partnerId, name) => {
    setReceiverId(partnerId);
    setChatPartner(name);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
      <Header />

      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
        <div className="mb-4">
          <select
            onChange={(e) =>
              handleSelectPartner(
                e.target.value,
                e.target.options[e.target.selectedIndex].text
              )
            }
            className="p-2 border border-gray-300 rounded-lg"
            value={receiverId}
          >
            {dummyUsers
              .filter((user) => user.id !== authUser?._id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center mb-4 bg-white rounded-lg shadow p-3">
          <img
            src="/avatar.png"
            className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-pink-300"
            alt={chatPartner}
          />
          <h2 className="text-xl font-semibold text-gray-800">{chatPartner}</h2>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Start your conversation with {chatPartner}
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
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;