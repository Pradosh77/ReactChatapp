import List from "./components/list/List.jsx"
import Chat from "./components/chat/Chat.jsx"
import Detail from "./components/detail/Detail.jsx"
import Login from "./components/login/Login.jsx"
import Notification from "./components/notification/Notification.jsx"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Library/firebase.js"
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from './Library/Store/userSlice.js';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isLoading = useSelector((state) => state.user.isLoading);
  const chatId = useSelector((state) => state.chat.chatId);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth,(user) => {
      dispatch(fetchUserInfo(user?.uid));
    });

    return () => {
      unSub();
    };
  },[dispatch]);

  if(isLoading)
    return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {currentUser ?
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </> :
        <Login />
      }
      <Notification/>
    </div>
  );
}

export default App