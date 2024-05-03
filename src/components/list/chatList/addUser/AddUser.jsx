import { useState } from "react";
import { db } from "../../../../Library/firebase";
import "./adduser.css"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"; 
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddUser = ({onAdduser}) => {

    const currentUser = useSelector((state) => state.user.currentUser);

    const [user,setUser] = useState(null)

    const handleSearch = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
    
        try {
          const userRef = collection(db, "users");
    
          const q = query(userRef, where("username", "==", username));
    
          const querySnapShot = await getDocs(q);
    
          if (!querySnapShot.empty) {
            setUser(querySnapShot.docs[0].data());
          }
        } catch (err) {
          console.log(err);
        }
    }

    const handelAdd = async () => {
         const chatRef = collection(db,"chats")
         const userChatsRef = collection(db,"userchats")

        try {
            const newChatref = doc(chatRef)

            // Check if user is already in the chat list
            const addedUserChatsListRef = doc(db, "userchats", currentUser.id);
            const docSnapshot = await getDoc(addedUserChatsListRef);
            const currentChatList = docSnapshot.data();
            if (currentChatList?.chats.some(chat => chat.receiverId === user.id)) {
                return toast.warn("Oops! Looks like the user is already in the chat list.");
            }

            if (user.id === currentUser.id) {
                return toast.error("Oops! Can't add yourself !");
            }

            await setDoc(newChatref, {
                createdAt:serverTimestamp(),
                messages:[],
            })
            
            await updateDoc(doc(userChatsRef,user.id),{
                chats:arrayUnion({
                    chatId: newChatref.id,
                    lastMessage:"",
                    receiverId: currentUser.id,
                    updatedAt:Date.now(),
                })
            });

            await updateDoc(doc(userChatsRef,currentUser.id),{
                chats:arrayUnion({
                    chatId: newChatref.id,
                    lastMessage:"",
                    receiverId: user.id,
                    updatedAt:Date.now(),
                })
            });

            onAdduser();

         } catch(err){
            console.log(err);
         }
    }

    return (
        <div className="addUser">
            <form action="" onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={ user.avatar || "./favicon.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handelAdd}>Add User</button>
            </div>
            }
        </div>
    )
}

export default AddUser