import { useAuthStore } from '../store/useAuthStore';

const ChatPage = () => {
  const {  authUserName, authUserLastName} = useAuthStore();

  console.log(authUserLastName, authUserName);
  return (
    <div>
      Chat page
    </div>
  )
}

export default ChatPage
